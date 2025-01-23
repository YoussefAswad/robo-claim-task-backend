import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Environment } from 'src/common/constants/environment';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { UploadService } from './upload.service';
import { Request } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: Environment.MAX_FILE_SIZE,
            message: 'File too large',
          }),
          new FileTypeValidator({
            fileType: RegExp(
              'application/pdf|text/csv|application/vnd.ms-excel',
            ),
          }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    console.log('user', req.user);
    const message = await this.uploadService.saveFiles(files, req.user['sub']);

    return { message };
  }
}
