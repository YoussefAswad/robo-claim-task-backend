import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  Sse,
  UseGuards,
  MessageEvent,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Request } from 'express';
import { FilesService } from './files.service';
import { UUIDParam } from 'src/common/validators/uuid-param.validator';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { QueryFilesDto } from './dtos/query-files.dto';
import { QueryFilesResponseDto } from './dtos/query-files-reponse.dto';
import { FileDto } from './dtos/file.dto';
import { FileSummaryDto } from './dtos/file-summary.dto';
import { interval, map, Observable, switchMap } from 'rxjs';
import { DocumentsProducer } from '../background-jobs/documents/documents.producer';

@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private readonly documentsProducer: DocumentsProducer,
  ) {}

  @ApiOkResponse({
    type: QueryFilesResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  readMany(@Req() reqeust: Request, @Query() query: QueryFilesDto) {
    return this.filesService.readMany(reqeust.user['sub'], query);
  }

  @Sse('progress/:id')
  sse(@Param() { id }: { id: number }): Observable<MessageEvent> {
    return interval(1000).pipe(
      switchMap(async () => {
        // Replace 'reqeust.user["sub"]' with the correct user identification logic.
        const progress = await this.documentsProducer.getJobsProgress(id);
        console.log(progress);
        return { data: progress };
      }),
      map((data, index) => ({
        data,
        id: index.toString(),
        type: 'progress',
      })),
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('summary')
  @ApiOkResponse({
    type: FileSummaryDto,
  })
  stats(@Req() reqeust: Request) {
    return this.filesService.getSummary(reqeust.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'File id',
  })
  @ApiOkResponse({
    type: FileDto,
  })
  @Get(':id')
  readOne(@Req() reqeust: Request, @Param() { id }: UUIDParam) {
    return this.filesService.readOne(reqeust.user['sub'], id);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'File id',
  })
  @UseGuards(AccessTokenGuard)
  @Get('download/:id')
  download(@Req() reqeust: Request, @Param() { id }: UUIDParam) {
    return this.filesService.download(reqeust.user['sub'], id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'File id',
  })
  @Delete(':id')
  delete(@Req() reqeust: Request, @Param() { id }: UUIDParam) {
    return this.filesService.delete(reqeust.user['sub'], id);
  }
}
