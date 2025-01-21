import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateFile } from './types/create-file.interface';
import { FileStatus } from './types/file-status.type';
import * as crypto from 'crypto';
import { QueryFilesDto } from 'src/apps/files/dtos/query-files.dto';
import { QueryFilesResponseDto } from 'src/apps/files/dtos/query-files-reponse.dto';

@Injectable()
export class FileRepositoryService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async create(file: CreateFile): Promise<FileEntity> {
    return this.fileRepository.save(file);
  }

  async findMany(
    userId: number,
    query: QueryFilesDto,
  ): Promise<QueryFilesResponseDto> {
    const {
      page,
      pageSize,
      originalName,
      status,
      mimetype,
      sortField,
      sortType,
    } = query;

    console.log('query', query);

    const [files, total] = await this.fileRepository.findAndCount({
      where: {
        status: status,
        originalName: originalName ? ILike(`%${originalName}%`) : undefined,
        mimeType: mimetype,
        userId: userId,
      },
      order: {
        [sortField || 'createdAt']: sortType,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      total,
      page: +page,
      pageSize: +pageSize,
      data: files,
      sortType,
      sortField,
    };
  }

  async findOne(userId: number, fileId: string): Promise<FileEntity> {
    return this.fileRepository.findOne({
      where: {
        userId: userId,
        id: fileId,
      },
    });
  }

  async delete(userId: number, fileId: string): Promise<void> {
    await this.fileRepository.delete({
      userId,
      id: fileId,
    });
  }

  async addData(fileId: string, data: any): Promise<void> {
    await this.fileRepository.update(fileId, { data });
  }

  async changeStatus(
    fileId: string,
    status: FileStatus,
    failedReason?: string,
  ): Promise<void> {
    await this.fileRepository.update(fileId, { status, failedReason });
  }

  async checkExists(file: Buffer): Promise<boolean> {
    const hash = crypto.createHash('sha256').update(file).digest('hex');

    const exists = await this.fileRepository.findOne({
      where: {
        hash,
      },
    });

    return !!exists;
  }

  async findByStatus(
    userId: number,
    statuses: FileStatus[],
  ): Promise<FileEntity[]> {
    return this.fileRepository.find({
      where: {
        userId,
        status: In(statuses),
      },
    });
  }
}
