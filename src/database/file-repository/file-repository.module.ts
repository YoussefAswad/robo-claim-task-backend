import { Module } from '@nestjs/common';
import { FileRepositoryService } from './file-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileRepositoryService],
  exports: [FileRepositoryService],
})
export class FileRepositoryModule {}
