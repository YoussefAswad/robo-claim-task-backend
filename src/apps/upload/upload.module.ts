import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FileRepositoryModule } from 'src/database/file-repository/file-repository.module';
import { DocumentsModule } from '../background-jobs/documents/documents.module';
import { UserRepositoryModule } from 'src/database/user-repository/user-repository.module';
import { LogsRepositoryModule } from 'src/database/logs-repository/logs-repository.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    FileRepositoryModule,
    DocumentsModule,
    UserRepositoryModule,
    LogsRepositoryModule,
  ],
})
export class UploadModule {}
