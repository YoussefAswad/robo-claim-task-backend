import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { FileSortField } from '../types/files-sort-field.type';
import { FileSortFields } from '../constants/file-sort-fields';
import { SortType } from 'src/common/types/sort-type.type';
import { SortTypes } from 'src/common/constants/sort-types';
import { FileStatus } from 'src/database/file-repository/types/file-status.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryFilesDto {
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
  originalName?: string;

  @ApiProperty({
    required: false,
    enum: ['completed', 'processing', 'failed', 'pending'],
  })
  @IsIn(['completed', 'processing', 'failed', 'pending'])
  @IsOptional()
  status?: FileStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mimetype?: string;

  @ApiProperty({ required: false, enum: FileSortFields })
  @IsOptional()
  @IsIn(FileSortFields)
  sortField?: FileSortField;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(SortTypes)
  sortType: SortType = 'asc';
}
