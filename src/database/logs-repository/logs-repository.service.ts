import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './logs.entity';
import { Repository } from 'typeorm';

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
  ) {}

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
