import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log, Report } from 'src/models';
import { ReportLogsModule } from 'src/report-logs/report-logs.module';
import { ReportLogsService } from 'src/report-logs/report-logs.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Report, Log]),
    ReportLogsModule,
    NotificationsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportLogsService, NotificationsService],
})
export class ReportsModule {}
