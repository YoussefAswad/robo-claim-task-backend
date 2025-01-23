import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsNumber,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { UserDto } from 'src/apps/auth/dto/user.dto';

export class FileDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  originalName: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsNumber()
  size: number;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsString()
  dataSnippet: any;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
