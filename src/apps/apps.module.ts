import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BackgroundJobsModule } from './background-jobs/background-jobs.module';
import { UploadModule } from './upload/upload.module';
import { FilesModule } from './files/files.module';
import { ProgressModule } from './progress/progress.module';
import { LogsModule } from './logs-con/logs.module';

@Module({
  imports: [
    AuthModule,
    BackgroundJobsModule,
    UploadModule,
    FilesModule,
    ProgressModule,
    LogsModule,
  ],
})
export class AppsModule {}
