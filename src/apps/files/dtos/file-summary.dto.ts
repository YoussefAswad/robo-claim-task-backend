import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsArray,
  IsObject,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class FileTypeCount {
  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: 'Count of files with this MIME type',
    example: 42,
  })
  @IsNumber()
  count: number;
}

class FileStatusCounts {
  @ApiProperty({ description: 'Number of pending files', example: 10 })
  @IsNumber()
  @IsOptional()
  pending: number;

  @ApiProperty({ description: 'Number of files being processed', example: 5 })
  @IsNumber()
  @IsOptional()
  processing: number;

  @ApiProperty({ description: 'Number of completed files', example: 20 })
  @IsNumber()
  @IsOptional()
  completed: number;

  @ApiProperty({ description: 'Number of failed files', example: 2 })
  @IsNumber()
  @IsOptional()
  failed: number;
}

export class FileSummaryDto {
  @ApiProperty({ description: 'Total number of files', example: 100 })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Failure rate (ratio of failed files to total)',
    example: 0.02,
  })
  @IsNumber()
  failiureRate: number;

  @ApiProperty({
    description: 'Counts of files grouped by MIME type',
    type: [FileTypeCount],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileTypeCount)
  typeCounts: FileTypeCount[];

  @ApiProperty({
    description: 'Counts of files grouped by status',
    type: FileStatusCounts,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => FileStatusCounts)
  statusCounts: FileStatusCounts;
}
