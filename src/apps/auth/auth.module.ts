import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { Environment } from 'src/common/constants/environment';
import { UserRepositoryModule } from 'src/database/user-repository/user-repository.module';
import { RefreshTokenRepositoryModule } from 'src/database/refresh-token-repository/refresh-token-repository.module';

@Module({
  imports: [
    JwtModule.register({
      secret: Environment.JWT_SECRET,
    }),
    UserRepositoryModule,
    RefreshTokenRepositoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
