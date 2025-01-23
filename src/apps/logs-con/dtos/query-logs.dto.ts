import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SortType } from 'src/common/types/sort-type.type';
import { SortTypes } from 'src/common/constants/sort-types';
import { FileStatus } from 'src/database/file-repository/types/file-status.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryLogsDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    enum: ['info', 'error', 'warning', ''],
  })
  @IsIn(['info', 'error', 'warning', ''])
  @IsOptional()
  status?: FileStatus;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(SortTypes)
  sortType: SortType = 'asc';
}
