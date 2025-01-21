import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileRepositoryModule } from 'src/database/file-repository/file-repository.module';
import { DocumentsModule } from '../background-jobs/documents/documents.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [FileRepositoryModule, DocumentsModule],
})
export class FilesModule {}
