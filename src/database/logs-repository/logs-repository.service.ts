import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './logs.entity';
import { Repository, ILike } from 'typeorm';
import { QueryLogsDto } from 'src/apps/logs-con/dtos/query-logs.dto';
import { QueryLogsResponseDto } from 'src/apps/logs-con/dtos/query-logs-response.dto';
import { UserRepositoryService } from '../user-repository/user-repository.service';

interface CreateLog {
  userId: number;
  fileId?: string;
  action: string;
}

@Injectable()
export class LogsRepositoryService {
  constructor(
    @InjectRepository(LogEntity)
    private refreshTokenRepository: Repository<LogEntity>,
    private userRepository: UserRepositoryService,
  ) {}

  async getLogs(
    userId: number,
    { page, pageSize, search, status, sortType }: QueryLogsDto,
  ): Promise<QueryLogsResponseDto> {
    const isAdmin = await this.userRepository.isAdmin(userId);

    console.log('query', { page, pageSize, search, status, sortType });
    const [logs, total] = await this.refreshTokenRepository.findAndCount({
      where: {
        action: search ? ILike(`%${search}%`) : undefined,
        type: status ? status : undefined,
        userId: isAdmin ? undefined : userId,
      },
      order: {
        createdAt: sortType,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        user: true,
      },
    });

    return {
      data: logs,
      page,
      pageSize,
      total,
    };
  }

  async info(data: CreateLog): Promise<void> {
    await this.create({ ...data, type: 'info' });
  }

  async error(data: CreateLog): Promise<void> {
    await this.create({ ...data, type: 'error' });
  }

  async warning(data: CreateLog): Promise<void> {
    await this.create({ ...data, type: 'warning' });
  }

  private async create({
    userId,
    fileId,
    action,
    type,
  }: CreateLog & { type: string }): Promise<void> {
    const createdAt = new Date();
    this.refreshTokenRepository.save({
      createdAt,
      userId,
      fileId,
      action,
      type,
    });
  }
}
