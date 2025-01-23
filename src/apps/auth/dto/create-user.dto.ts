import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;

  @ApiProperty()
  @IsBoolean()
  public isAdmin: boolean;
}
