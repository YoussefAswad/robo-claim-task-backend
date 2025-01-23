import { Module } from '@nestjs/common';
import { LogsRepositoryService } from './logs-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './logs.entity';
import { UserRepositoryModule } from '../user-repository/user-repository.module';

@Module({
  providers: [LogsRepositoryService],
  imports: [TypeOrmModule.forFeature([LogEntity]), UserRepositoryModule],
  exports: [LogsRepositoryService],
})
export class LogsRepositoryModule {}
