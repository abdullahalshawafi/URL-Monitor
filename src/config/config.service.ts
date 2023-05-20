import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as dotenv from 'dotenv';
import * as path from 'path';
import entities from '../models';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public get(key: string): string {
    return this.getValue(key);
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USERNAME'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DB'),

      entities,

      synchronize: true,
    };
  }

  public getJwtConfig(): JwtModuleOptions {
    return {
      secret: this.getValue('JWT_SECRET'),
      signOptions: {
        expiresIn: this.getValue('JWT_EXPIRATION_TIME'),
      },
    };
  }

  public getMailerConfig(): MailerOptions {
    return {
      transport: {
        host: this.getValue('MAILER_HOST'),
        port: parseInt(this.getValue('MAILER_PORT')),
        auth: {
          user: this.getValue('MAILER_USER'),
          pass: this.getValue('MAILER_PASSWORD'),
        },
      },
      defaults: {
        from: this.getValue('MAILER_FROM'),
      },
      template: {
        dir: path.join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USERNAME',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'JWT_SECRET',
  'JWT_EXPIRATION_TIME',
  'MAILER_JWT_SECRET',
  'MAILER_JWT_EXPIRATION_TIME',
  'MAILER_HOST',
  'MAILER_PORT',
  'MAILER_USER',
  'MAILER_PASSWORD',
  'MAILER_FROM',
  'EMAIL_VERIFICATION_URL',
  'PUSHOVER_USER_KEY',
  'PUSHOVER_APP_TOKEN',
]);

export { configService };
