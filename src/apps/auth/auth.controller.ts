import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'User registered successfully',
    type: TokenResponseDto,
  })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: TokenResponseDto,
  })
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  @ApiOkResponse({
    description: 'User logged out successfully',
  })
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub'], req.user['refreshToken']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOkResponse({
    description: 'User tokens refreshed successfully',
    type: TokenResponseDto,
  })
  refreshTokens(@Req() req: Request) {
    console.log('req.user', req.user);
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
