import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { configService } from 'src/config/config.service';
import { EmailVerificationToken } from 'src/models';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([EmailVerificationToken]),
    JwtModule.register(configService.getJwtConfig()),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
