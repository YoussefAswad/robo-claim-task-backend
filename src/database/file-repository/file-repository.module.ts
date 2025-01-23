import { Module } from '@nestjs/common';
import { FileRepositoryService } from './file-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { UserRepositoryModule } from '../user-repository/user-repository.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), UserRepositoryModule],
  providers: [FileRepositoryService],
  exports: [FileRepositoryService],
})
export class FileRepositoryModule {}
