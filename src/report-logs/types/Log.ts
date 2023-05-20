import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LogType {
  @IsNotEmpty()
  timestamp: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  responseTime: number;
}
