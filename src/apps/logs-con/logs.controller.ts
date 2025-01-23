import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { QueryLogsDto } from './dtos/query-logs.dto';
import { QueryLogsResponseDto } from './dtos/query-logs-response.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Request } from 'express';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiOkResponse({
    type: QueryLogsResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  readMany(@Req() reqeust: Request, @Query() query: QueryLogsDto) {
    console.log('reqeust', query);
    return this.logsService.readMany(reqeust.user['sub'], query);
  }
}
