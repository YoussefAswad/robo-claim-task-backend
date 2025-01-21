import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepositoryService } from 'src/database/user-repository/user-repository.service';
import { RefreshTokenRepositoryService } from 'src/database/refresh-token-repository/refresh-token-repository.service';
import { Environment } from 'src/common/constants/environment';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepositoryService,
    private refreshTokenRepository: RefreshTokenRepositoryService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);

    console.log('hash', hash);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.createRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.userRepository.findOne({ email: data.email });
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    await this.createRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number, refreshToken: string) {
    const tokens =
      await this.refreshTokenRepository.findUserRefreshTokens(userId);

    for (const token of tokens) {
      const refreshTokenMatches = await argon2.verify(
        token.token,
        refreshToken,
      );
      if (refreshTokenMatches) {
        await this.refreshTokenRepository.delete(userId, token.token);
        return;
      }
    }
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user || user.refreshTokens.length === 0)
      throw new ForbiddenException('Access Denied');
    const refreshTokensStatus = await Promise.all(
      user.refreshTokens.map((token) =>
        argon2.verify(token.token, refreshToken),
      ),
    );

    const refreshTokenMatches = refreshTokensStatus.some((status) => status);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = {
      accessToken: await this.getAccessToken(user.id, user.email),
      refreshToken: refreshToken,
    };
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async createRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = {
      userId,
      token: await this.hashData(refreshToken),
      expiresAt: new Date(
        Date.now() +
          Environment.JWT_REFRESH_EXPIRATION_TIME_IN_DAYS * 24 * 60 * 60 * 1000,
      ),
    };

    return this.refreshTokenRepository.create(hashedRefreshToken);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: Environment.JWT_SECRET,
          expiresIn: `${Environment.JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES}m`,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: Environment.JWT_SECRET,
          expiresIn: `${Environment.JWT_REFRESH_EXPIRATION_TIME_IN_DAYS}d`,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getAccessToken(userId: number, email: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: Environment.JWT_SECRET,
        expiresIn: `${Environment.JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES}m`,
      },
    );
  }

  async getRefreshToken(userId: number, email: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: Environment.JWT_SECRET,
        expiresIn: `${Environment.JWT_REFRESH_EXPIRATION_TIME_IN_DAYS}d`,
      },
    );
  }
}
