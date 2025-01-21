import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Request } from 'express';
import { FilesService } from './files.service';
import { UUIDParam } from 'src/common/validators/uuid-param.validator';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QueryFilesDto } from './dtos/query-files.dto';
import { QueryFilesResponseDto } from './dtos/query-files-reponse.dto';
import { FileDto } from './dtos/file.dto';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOkResponse({
    type: QueryFilesResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  readMany(@Req() reqeust: Request, @Query() query: QueryFilesDto) {
    return this.filesService.readMany(reqeust.user['sub'], query);
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
