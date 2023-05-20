import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configService } from './config/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UrlsModule } from './urls/urls.module';
import { ReportsModule } from './reports/reports.module';
import { MonitorsModule } from './monitors/monitors.module';
import { ReportLogsModule } from './report-logs/report-logs.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    MailerModule.forRoot(configService.getMailerConfig()),
    UrlsModule,
    ReportsModule,
    MonitorsModule,
    ReportLogsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
