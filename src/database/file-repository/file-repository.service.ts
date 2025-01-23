import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FindOneOptions, ILike, In, Repository } from 'typeorm';
import { CreateFile } from './types/create-file.interface';
import { FileStatus } from './types/file-status.type';
import * as crypto from 'crypto';
import { QueryFilesDto } from 'src/apps/files/dtos/query-files.dto';
import { QueryFilesResponseDto } from 'src/apps/files/dtos/query-files-reponse.dto';
import { UserRepositoryService } from '../user-repository/user-repository.service';
import { FindOptionsWhere } from 'typeorm/browser';

const fileSerializer: FindOneOptions<FileEntity>['relations'] = {
  user: true,
};

@Injectable()
export class FileRepositoryService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private userRepository: UserRepositoryService,
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

    const isAdmin = await this.userRepository.isAdmin(userId);

    const [files, total] = await this.fileRepository.findAndCount({
      where: {
        status: status,
        originalName: originalName ? ILike(`%${originalName}%`) : undefined,
        mimeType: mimetype ? ILike(`%${mimetype}%`) : undefined,
        userId: isAdmin ? undefined : userId,
      },
      order: {
        [sortField || 'createdAt']: sortType,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: fileSerializer,
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
    const isAdmin = await this.userRepository.isAdmin(userId);
    return this.fileRepository.findOne({
      where: {
        userId: isAdmin ? undefined : userId,
        id: fileId,
      },
      relations: fileSerializer,
    });
  }

  async delete(userId: number, fileId: string): Promise<void> {
    const isAdmin = await this.userRepository.isAdmin(userId);
    console.log('isAdmin', isAdmin);
    console.log('userId', userId);
    console.log('fileId', fileId);

    const where: FindOptionsWhere<FileEntity> = {
      id: fileId,
    };

    if (!isAdmin) {
      where.userId = userId;
    }

    await this.fileRepository.delete(where);
  }

  async addData(fileId: string, data: any): Promise<void> {
    await this.fileRepository.update(fileId, {
      data,
      dataSnippet: JSON.stringify(data).slice(0, 100),
    });
  }

  async changeStatus(
    fileId: string,
    status: FileStatus,
    failedReason?: string,
  ): Promise<void> {
    await this.fileRepository.update(fileId, { status, failedReason });
  }

  async checkExists(userId: number, file: Buffer): Promise<boolean> {
    const hash = crypto.createHash('sha256').update(file).digest('hex');

    const exists = await this.fileRepository.findOne({
      where: {
        hash,
        userId,
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

  async getSummary(userId: number): Promise<any> {
    const isAdmin = await this.userRepository.isAdmin(userId);
    const fileTypeCountsQuery = isAdmin
      ? `select f."mimeType", count(*) from files f group by f."mimeType"`
      : `select f."mimeType", count(*) from files f WHERE "userId" = $1 group by f."mimeType"`;

    const fileTypeCounts = await this.fileRepository.query(
      fileTypeCountsQuery,
      isAdmin ? [] : [userId],
    );

    const total = await this.fileRepository.count({
      where: {
        userId: isAdmin ? undefined : userId,
      },
    });

    const fileStatusCountsQuery = isAdmin
      ? `select f.status, count(*) from files f group by f.status`
      : `select f.status, count(*) from files f WHERE "userId" = $1 group by f.status`;

    const fileStatusCounts = await this.fileRepository.query(
      fileStatusCountsQuery,
      isAdmin ? [] : [userId],
    );

    return {
      total,
      failiureRate:
        fileStatusCounts.find((status) => status.status === 'failed')?.count ??
        0 / total,
      typeCounts: fileTypeCounts.map(({ mimeType, count }) => ({
        mimeType,
        count: +count,
      })),
      statusCounts: fileStatusCounts.reduce(
        (acc, { status, count }) => ({ ...acc, [status]: +count }),
        {
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0,
        },
      ),
    };
  }
}
