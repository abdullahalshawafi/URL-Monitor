import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUppercase,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Protocol } from '../types/Protocol';
import { AuthenticationParams } from '../types/AuthenticationParams';
import { AssertParams } from '../types/AssertParams';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  url: string;

  @IsNotEmpty()
  @IsUppercase()
  @IsEnum(Protocol)
  protocol: Protocol;

  @IsOptional()
  @IsString()
  path: string;

  @IsOptional()
  @IsNumber()
  port: number;

  @IsOptional()
  @IsString()
  webhook: string;

  @IsOptional()
  @IsNumber()
  timeout: number;

  @IsOptional()
  @IsNumber()
  interval: number;

  @IsOptional()
  @IsNumber()
  threshold: number;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AuthenticationParams)
  authentication: Record<string, string>;

  @IsOptional()
  @IsObject()
  httpHeaders: Record<string, string>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AssertParams)
  assert: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsBoolean()
  ignoreSSL: boolean;
}
