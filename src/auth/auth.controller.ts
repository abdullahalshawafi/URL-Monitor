import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );
    return {
      message: 'Registration successful',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const jwtToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return {
      message: 'Login successful',
      access_token: jwtToken,
    };
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return {
      message: 'Email verification successful',
    };
  }
}
