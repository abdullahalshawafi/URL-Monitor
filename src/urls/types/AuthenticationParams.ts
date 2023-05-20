import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationParams {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
