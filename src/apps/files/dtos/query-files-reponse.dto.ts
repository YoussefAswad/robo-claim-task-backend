import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { FileDto } from './file.dto';
import { FileSortField } from '../types/files-sort-field.type';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFilesResponseDto {
  @ApiProperty({
    isArray: true,
    type: FileDto,
  })
  @ValidateNested()
  @Type(() => FileDto)
  data: FileDto[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  sortField?: FileSortField;
  @ApiProperty()
  sortType?: 'asc' | 'desc';
  @ApiProperty()
  total?: number;
}
