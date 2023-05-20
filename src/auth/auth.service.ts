import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { EmailVerificationToken } from 'src/models';
import { UsersService } from 'src/users/users.service';
import { configService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register(name: string, email: string, password: string) {
    let user = await this.usersService.findOneByEmail(email);
    if (user && user.isEmailVerified) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailVerificationTokenInDb =
      await this.emailVerificationTokenRepository.findOneBy({
        email,
      });

    // If the user is not verified and the token is not expired, we will not send another email
    if (user && emailVerificationTokenInDb) {
      const decoded = this.jwtService.decode(
        emailVerificationTokenInDb.token,
      ) as any;
      if (decoded.exp > Date.now() / 1000) {
        throw new HttpException(
          'Your email is not verified yet. Please check your email for the verification link.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: configService.get('MAILER_JWT_SECRET'),
      expiresIn: configService.get('MAILER_JWT_EXPIRATION_TIME'),
    });

    const emailVerificationToken = this.emailVerificationTokenRepository.create(
      { token, email },
    );

    const emailVerificationUrl = `${configService.get(
      'EMAIL_VERIFICATION_URL',
    )}/${token}`;
    const result = await this.mailerService.sendMail({
      to: email,
      subject: 'Please verify your email',
      template: 'email-verification',
      context: { name, emailVerificationUrl },
    });

    if (!result || !result.messageId) {
      throw new HttpException(
        `Failed to send verification email to ${email}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.emailVerificationTokenRepository.save(emailVerificationToken);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await this.usersService.create(name, email, hashedPassword);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    delete user.password;
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }

  async verifyEmail(token: string) {
    const emailVerificationToken =
      await this.emailVerificationTokenRepository.findOneBy({ token });
    if (!emailVerificationToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOneByEmail(
      emailVerificationToken.email,
    );
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const payload = this.jwtService.verify(token, {
      secret: configService.get('MAILER_JWT_SECRET'),
    });
    if (payload.email !== user.email) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    user.isEmailVerified = true;
    await this.usersService.verifyUser(user.id);

    await this.emailVerificationTokenRepository.delete(
      emailVerificationToken.id,
    );
  }
}
