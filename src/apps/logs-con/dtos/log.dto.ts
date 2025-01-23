import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumberString,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UserDto } from 'src/apps/auth/dto/user.dto';

export class LogDto {
  @ApiProperty()
  @IsNumberString()
  id: number;

  @ApiProperty()
  @IsNumberString()
  userId: number;

  @ApiProperty()
  @IsUUID()
  fileId?: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
