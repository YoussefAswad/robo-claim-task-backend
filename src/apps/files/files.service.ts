import { StorageService } from '@codebrew/nestjs-storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileRepositoryService } from 'src/database/file-repository/file-repository.service';
import { QueryFilesDto } from './dtos/query-files.dto';
import { DocumentsProducer } from '../background-jobs/documents/documents.producer';
import { LogsRepositoryService } from 'src/database/logs-repository/logs-repository.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FileRepositoryService,
    private readonly storage: StorageService,
    private readonly documentsProducer: DocumentsProducer,
    private readonly logsRepository: LogsRepositoryService,
  ) {}

  async readMany(userId: number, query: QueryFilesDto) {
    await this.logsRepository.info({
      userId,
      action: 'Files list requested',
    });
    return this.filesRepository.findMany(userId, query);
  }

  async readOne(userId: number, fileId: string) {
    await this.logsRepository.info({
      userId,
      action: `File ${fileId} requested`,
      fileId,
    });
    return this.filesRepository.findOne(userId, fileId);
  }

  async download(userId: number, fileId: string) {
    const file = await this.filesRepository.findOne(userId, fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.logsRepository.info({
      userId,
      action: `File ${fileId} downloaded`,
      fileId,
    });

    const fileStream = this.storage.getDisk().get(file.id);

    return fileStream;
  }

  async delete(userId: number, fileId: string) {
    const file = await this.filesRepository.findOne(userId, fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.logsRepository.info({
      userId,
      action: `File ${fileId} deleted`,
      fileId,
    });

    await this.documentsProducer.removeJob(fileId);
    await this.filesRepository.delete(userId, fileId);
    await this.storage.getDisk().delete(file.id);
  }

  async getSummary(userId: number) {
    await this.logsRepository.info({
      userId,
      action: 'Files summary requested',
    });

    return this.filesRepository.getSummary(userId);
  }
}
