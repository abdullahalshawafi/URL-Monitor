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

export class UpdateUrlDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUppercase()
  @IsEnum(Protocol)
  protocol: Protocol;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  path: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  port: number | null;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  webhook: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  timeout: number | null;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  interval: number | null;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  threshold: number | null;

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AuthenticationParams)
  authentication: Record<string, string> | null;

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  httpHeaders: Record<string, string> | null;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AssertParams)
  assert: Record<string, any> | null;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tags: string[] | null;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  ignoreSSL: boolean;
}
