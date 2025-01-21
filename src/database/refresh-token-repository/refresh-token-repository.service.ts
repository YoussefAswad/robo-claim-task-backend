import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { CreateRefreshToken } from './types/create-refresh-token.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RefreshTokenRepositoryService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async findUserRefreshTokens(userId: number): Promise<RefreshTokenEntity[]> {
    return this.refreshTokenRepository.find({
      where: {
        userId: userId,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async create(refreshToken: CreateRefreshToken): Promise<RefreshTokenEntity> {
    return this.refreshTokenRepository.save(refreshToken);
  }

  async delete(userId: number, token: string): Promise<void> {
    await this.refreshTokenRepository.delete({
      userId,
      token,
    });
  }
}
