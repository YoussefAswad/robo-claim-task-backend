import { Module } from '@nestjs/common';
import { ProgressGateway } from './progress.gateway';
import { FileRepositoryModule } from 'src/database/file-repository/file-repository.module';
import { DocumentsModule } from '../background-jobs/documents/documents.module';

@Module({
  providers: [ProgressGateway],
  imports: [FileRepositoryModule, DocumentsModule],
})
export class ProgressModule {}
