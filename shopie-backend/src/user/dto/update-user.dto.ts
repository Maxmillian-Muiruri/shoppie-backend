import { IsEmail, IsOptional, IsString, MinLength, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  resetPasswordCode?: string | null;

  @IsOptional()
  @IsDateString()
  resetPasswordCodeExpiry?: Date | string | null;
}
