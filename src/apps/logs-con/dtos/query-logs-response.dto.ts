import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LogDto } from './log.dto';

export class QueryLogsResponseDto {
  @ApiProperty({
    isArray: true,
    type: LogDto,
  })
  @ValidateNested()
  @Type(() => LogDto)
  data: LogDto[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  sortType?: 'asc' | 'desc';
  @ApiProperty()
  total?: number;
}
