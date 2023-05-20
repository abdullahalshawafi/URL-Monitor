import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
