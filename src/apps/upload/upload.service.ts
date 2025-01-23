import { StorageService } from '@codebrew/nestjs-storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileRepositoryService } from 'src/database/file-repository/file-repository.service';
import { DocumentsProducer } from '../background-jobs/documents/documents.producer';
import { UserRepositoryService } from 'src/database/user-repository/user-repository.service';
import crypto from 'node:crypto';
import { LogsRepositoryService } from 'src/database/logs-repository/logs-repository.service';

export type FileUploadStatus = 'failed' | 'duplicate' | 'success';

@Injectable()
export class UploadService {
  constructor(
    private readonly storage: StorageService,
    private readonly fileRepository: FileRepositoryService,
    private readonly documentsProducer: DocumentsProducer,
    private readonly userRepository: UserRepositoryService,
    private readonly logsRepository: LogsRepositoryService,
  ) {}

  private async saveFile(
    file: Express.Multer.File,
    userId: number,
  ): Promise<FileUploadStatus> {
    if (await this.fileRepository.checkExists(userId, file.buffer)) {
      await this.logsRepository.warning({
        userId,
        action: `Duplicate file ${file.originalname}`,
      });

      return 'duplicate';
    }

    const dbFile = await this.fileRepository.create({
      userId,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      hash: crypto.createHash('sha256').update(file.buffer).digest('hex'),
    });

    await this.storage.getDisk().put(dbFile.id, file.buffer);

    await this.logsRepository.info({
      userId,
      action: `File ${file.originalname} uploaded`,
      fileId: dbFile.id,
    });

    await this.documentsProducer.addDocumentJob({
      id: dbFile.id,
      userId,
      mimeType: dbFile.mimeType,
    });

    return 'success';
  }
  async saveFiles(
    files: Express.Multer.File[],
    userId: number,
  ): Promise<string> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdFiles = await Promise.all(
      files.map((file) => {
        return this.saveFile(file, userId);
      }),
    );

    const failedNumber = createdFiles.filter((status) => status === 'failed');
    const duplicateNumber = createdFiles.filter(
      (status) => status === 'duplicate',
    );
    const successNumber = createdFiles.filter((status) => status === 'success');

    let message = '';

    if (failedNumber.length) {
      message += `${failedNumber.length} files failed to upload. `;
    }

    if (duplicateNumber.length) {
      message += `${duplicateNumber.length} files are duplicates. `;
    }

    if (successNumber.length) {
      message += `${successNumber.length} files uploaded successfully. `;
    }

    return message;
  }
}
