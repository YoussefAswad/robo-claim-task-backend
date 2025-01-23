import { Module } from '@nestjs/common';
import { LogsRepositoryService } from './logs-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './logs.entity';

@Module({
  providers: [LogsRepositoryService],
  imports: [TypeOrmModule.forFeature([LogEntity])],
  exports: [LogsRepositoryService],
})
export class LogsRepositoryModule {}
