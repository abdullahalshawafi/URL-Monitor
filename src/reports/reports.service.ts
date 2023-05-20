import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/models';
import { ReportLogsService } from 'src/report-logs/report-logs.service';
import { LogType } from 'src/report-logs/types/Log';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly reportLogsService: ReportLogsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(urlId: string) {
    const report = this.reportRepository.create({ url: { id: urlId } });
    return await this.reportRepository.save(report);
  }

  async findOne(urlId: string, userId: string) {
    const report = await this.reportRepository
      .createQueryBuilder('report')
      .innerJoin('report.url', 'url')
      .innerJoin('report.history', 'history')
      .addSelect('url.url')
      .addSelect('history.timestamp')
      .addSelect('history.status')
      .addSelect('history.responseTime')
      .where('url.id = :urlId', { urlId })
      .andWhere('url.userId = :userId', { userId })
      .orderBy('history.timestamp', 'DESC')
      .getOne();

    return report
      ? {
          id: report.id,
          url: report.url.url,
          status: report.isUp ? 'up' : 'down',
          availability: report.availability,
          outages: report.outages,
          downtime: report.downtime,
          uptime: report.uptime,
          responseTime: report.responseTime,
          history: report.history,
        }
      : null;
  }

  async findByTag(tag: string, userId: string) {
    const reports = await this.reportRepository
      .createQueryBuilder('report')
      .innerJoin('report.url', 'url')
      .innerJoin('report.history', 'history')
      .addSelect('url.url')
      .addSelect('history.timestamp')
      .addSelect('history.status')
      .addSelect('history.responseTime')
      .where('url.tags::jsonb @> :tag::jsonb', {
        tag: JSON.stringify(tag.toLowerCase()),
      })
      .andWhere('url.userId = :userId', { userId })
      .orderBy('url.createdAt', 'DESC')
      .addOrderBy('history.timestamp', 'DESC')
      .getMany();

    return reports.map((report) => ({
      id: report.id,
      url: report.url.url,
      status: report.isUp ? 'up' : 'down',
      availability: report.availability,
      outages: report.outages,
      downtime: report.downtime,
      uptime: report.uptime,
      responseTime: report.responseTime,
      history: report.history,
    }));
  }

  async save(monitor: Record<string, any>) {
    try {
      const urlId = monitor.urlId;
      const urlReport = await this.reportRepository
        .createQueryBuilder('report')
        .innerJoinAndSelect('report.url', 'url')
        .innerJoinAndSelect('url.user', 'user')
        .where('url.id = :urlId', { urlId })
        .getOne();

      if (!urlReport) {
        throw new Error('Url not found');
      }

      const report: { [key: string]: any } = {};
      const log = monitor.log;

      report.totalRequests = urlReport.totalRequests + 1;

      report.isUp = monitor.isUp;

      report.outages = urlReport.outages + (monitor.isUp ? 0 : 1);

      report.availability =
        Number(
          (
            ((report.totalRequests - report.outages) / report.totalRequests) *
            100
          ).toFixed(2),
        ) | 0;

      report.responseTime = Number(
        (
          (urlReport.responseTime * urlReport.totalRequests +
            monitor.responseTime) /
          (urlReport.totalRequests + 1)
        ).toFixed(2),
      );

      report.downtime =
        urlReport.downtime + (monitor.isUp ? 0 : urlReport.url.interval);

      report.uptime =
        urlReport.uptime + (monitor.isUp ? urlReport.url.interval : 0);

      report.downCount = urlReport.downCount + (monitor.isUp ? 0 : 1);

      if (
        report.downCount >= urlReport.url.threshold &&
        !report.isUp &&
        !urlReport.notified
      ) {
        console.log('Sending "url is down" notification');
        const isSent = await this.notificationsService.sendDownNotification(
          urlReport.url.user,
          urlReport.url.url,
        );
        if (isSent) {
          console.log('Notification sent!');
          report.notified = true;
        }
      }

      if (urlReport.notified && report.isUp) {
        console.log('Sending "url is up" notification');
        const isSent = await this.notificationsService.sendUpNotification(
          urlReport.url.user,
          urlReport.url.url,
        );
        if (isSent) {
          console.log('Notification sent!');
          report.notified = false;
          report.downCount = 0;
        }
      }

      await this.reportRepository.update(urlReport.id, report);
      await this.reportLogsService.create(urlReport.id, log as LogType);
    } catch (error) {
      console.log(error);
    }
  }
}
