import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log, Report, Url } from 'src/models';
import { ReportsModule } from 'src/reports/reports.module';
import { MonitorsModule } from 'src/monitors/monitors.module';
import { MonitorsService } from 'src/monitors/monitors.service';
import { ReportsService } from 'src/reports/reports.service';
import { ReportLogsModule } from 'src/report-logs/report-logs.module';
import { ReportLogsService } from 'src/report-logs/report-logs.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Url, Report, Log]),
    ReportsModule,
    ReportLogsModule,
    NotificationsModule,
    MonitorsModule,
  ],
  controllers: [UrlsController],
  providers: [
    UrlsService,
    MonitorsService,
    ReportsService,
    ReportLogsService,
    NotificationsService,
  ],
})
export class UrlsModule {}
