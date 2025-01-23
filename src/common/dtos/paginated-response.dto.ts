import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class PaginatedResponseDto<TData, TSortField> {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Object)
  data: TData[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  sortField?: TSortField;
  @ApiProperty()
  sortType?: 'asc' | 'desc';
  @ApiProperty()
  total?: number;
}
