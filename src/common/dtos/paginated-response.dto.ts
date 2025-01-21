import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<TData, TSortField> {
  @ApiProperty()
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
