import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppsModule } from './apps/apps.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './common/constants/environment';
import { BullModule } from '@nestjs/bullmq';
import { DriverType, StorageModule } from '@codebrew/nestjs-storage';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environment.DB_HOST,
      port: Environment.DB_PORT,
      username: Environment.DB_USER,
      password: Environment.DB_PASS,
      database: Environment.DB_NAME,
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BullModule.forRoot({
      connection: {
        host: Environment.REDIS_HOST,
        port: Environment.REDIS_PORT,
        password: Environment.REDIS_PASS,
      },
    }),
    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd() + '/uploads',
          },
        },
      },
    }),
    AppsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
