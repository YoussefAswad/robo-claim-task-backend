import { QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { Queues } from 'src/common/constants/queues';

import { OnQueueEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DocumentData } from './types/document-data.interface';
import { FileRepositoryService } from 'src/database/file-repository/file-repository.service';
import { Inject } from '@nestjs/common';

@QueueEventsListener(Queues.DOCUMENT)
export class DocumentsListiner extends QueueEventsHost {
  @Inject() private readonly filesRepository: FileRepositoryService;

  @OnQueueEvent('failed')
  async onFailed(job: Job<DocumentData, any, string>) {
    console.error('Failed', job);
    // await this.filesRepository.changeStatus(job.data.id, 'failed');
  }

  @OnQueueEvent('completed')
  async onCompleted(job: Job<DocumentData, DocumentData, string>) {
    console.log('Completed', job);
    await this.filesRepository.changeStatus(job.returnvalue.id, 'completed');
  }

  @OnQueueEvent('progress')
  async onProgress(job: Job<DocumentData, any, string>) {
    console.log('Progress', job.data);
  }
}
