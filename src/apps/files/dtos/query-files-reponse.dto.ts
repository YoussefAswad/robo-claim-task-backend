import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { FileDto } from './file.dto';
import { FileSortField } from '../types/files-sort-field.type';

export class QueryFilesResponseDto extends PaginatedResponseDto<
  FileDto,
  FileSortField
> {}
