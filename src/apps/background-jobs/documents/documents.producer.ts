import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Queues } from 'src/common/constants/queues';
import { DocumentData } from './types/document-data.interface';

@Injectable()
export class DocumentsProducer {
  constructor(@InjectQueue(Queues.DOCUMENT) private documentsQueue: Queue) {}

  async addDocumentJob(data: DocumentData) {
    await this.documentsQueue.add(`process-${data.id}`, data);
  }

  async getPendingJobs(userId: number) {
    const jobs = await this.documentsQueue.getJobs(['waiting', 'active']);

    console.log(jobs);
    return jobs.filter((job) => job.data.userId === userId);
  }

  async getJobsProgress(userId: number) {
    const jobs = await this.documentsQueue.getJobs(['waiting', 'active']);

    return jobs
      .filter((job) => job.data.userId === userId)
      .map((job) =>
        job.progress
          ? job.progress
          : {
              progress: 0,
              stage: 'Pending',
              fileId: job.data.id,
            },
      );
  }

  async removeJob(id: string) {
    const jobs = await this.documentsQueue.getJobs(['waiting', 'active']);

    const job = jobs.find((job) => job.data.id === id);

    if (job) {
      await job.remove();
    }
  }
}
