import { Module } from '@nestjs/common';
import { Log, Report } from 'src/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorsService } from './monitors.service';
import { ReportsModule } from 'src/reports/reports.module';
import { ReportsService } from 'src/reports/reports.service';
import { ReportLogsModule } from 'src/report-logs/report-logs.module';
import { ReportLogsService } from 'src/report-logs/report-logs.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Log]),
    ReportsModule,
    ReportLogsModule,
    NotificationsModule,
  ],
  providers: [
    MonitorsService,
    ReportsService,
    ReportLogsService,
    NotificationsService,
  ],
})
export class MonitorsModule {}
