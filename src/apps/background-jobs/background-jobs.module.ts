import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';

@Module({
  providers: [],
  imports: [DocumentsModule],
  exports: [],
})
export class BackgroundJobsModule {}
