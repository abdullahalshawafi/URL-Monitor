import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsAlphanumeric,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LoginDto {
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
