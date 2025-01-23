import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogsRepositoryModule } from 'src/database/logs-repository/logs-repository.module';
import { UserRepositoryModule } from 'src/database/user-repository/user-repository.module';

@Module({
  providers: [LogsService],
  controllers: [LogsController],
  imports: [LogsRepositoryModule, UserRepositoryModule],
})
export class LogsModule {}
