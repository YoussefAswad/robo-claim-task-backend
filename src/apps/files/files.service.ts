import { StorageService } from '@codebrew/nestjs-storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileRepositoryService } from 'src/database/file-repository/file-repository.service';
import { QueryFilesDto } from './dtos/query-files.dto';
import { DocumentsProducer } from '../background-jobs/documents/documents.producer';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FileRepositoryService,
    private readonly storage: StorageService,
    private readonly documentsProducer: DocumentsProducer,
  ) {}

  async readMany(userId: number, query: QueryFilesDto) {
    return this.filesRepository.findMany(userId, query);
  }

  async readOne(userId: number, fileId: string) {
    return this.filesRepository.findOne(userId, fileId);
  }

  async download(userId: number, fileId: string) {
    const file = await this.filesRepository.findOne(userId, fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileStream = this.storage.getDisk().get(file.id);

    return fileStream;
  }

  async delete(userId: number, fileId: string) {
    const file = await this.filesRepository.findOne(userId, fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.documentsProducer.removeJob(fileId);
    await this.filesRepository.delete(userId, fileId);
    await this.storage.getDisk().delete(file.id);
  }
}
