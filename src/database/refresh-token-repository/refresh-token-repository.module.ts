import { Module } from '@nestjs/common';
import { RefreshTokenRepositoryService } from './refresh-token-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';

@Module({
  providers: [RefreshTokenRepositoryService],
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  exports: [RefreshTokenRepositoryService],
})
export class RefreshTokenRepositoryModule {}
