import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssertParams {
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;
}
