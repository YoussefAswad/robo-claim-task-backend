import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { Queues } from 'src/common/constants/queues';
import { DocumentConsumer } from './documents.consumer';
import { DocumentsProducer } from './documents.producer';
import { FileRepositoryModule } from 'src/database/file-repository/file-repository.module';
import { DocumentsListiner } from './documents.listener';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.DOCUMENT,
    }),
    FileRepositoryModule,
  ],
  providers: [DocumentConsumer, DocumentsProducer, DocumentsListiner],
  exports: [DocumentsProducer],
})
export class DocumentsModule {}
