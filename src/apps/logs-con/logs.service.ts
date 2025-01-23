import { Injectable } from '@nestjs/common';
import { LogsRepositoryService } from 'src/database/logs-repository/logs-repository.service';
import { QueryLogsDto } from './dtos/query-logs.dto';

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepositoryService) {}

  async readMany(userId: number, query: QueryLogsDto) {
    return this.logsRepository.getLogs(userId, query);
  }
}
