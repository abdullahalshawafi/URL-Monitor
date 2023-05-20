import { Injectable } from '@nestjs/common';
import * as Monitor from 'ping-monitor';
import { Url } from 'src/models';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class MonitorsService {
  private monitors: { [key: string]: Monitor } = {};

  constructor(private readonly reportsService: ReportsService) {}

  async initializeMonitors(urls: Url[]) {
    console.log(`App is initializing ${urls.length} monitors`);
    urls.forEach((url) => {
      const monitor = this.create(url);
      this.monitors[url.id] = monitor;
    });
  }

  create(url: Url) {
    const httpHeaders = this.getUrlHttpHeaders(url);

    const monitorConfig = {
      urlId: url.id,
      website: url.url,
      title: url.name,
      port: url.port,
      protocol: url.protocol.toLowerCase(),
      interval: url.interval,
      timeout: url.timeout,
      ignoreSSL: url.ignoreSSL,
      httpOptions: {
        path: url.path,
        headers: Object.entries(httpHeaders).map(([key, value]) => ({
          [key]: value,
        })),
      },
      expect: {
        statusCode: url.assert?.statusCode ?? 200,
      },
    };

    const monitor = new Monitor(monitorConfig);

    monitor.on('up', (res: any) => {
      console.log('up');
      this.handleMonitorCallback('up', res, monitor);
    });

    monitor.on('down', (res: any) => {
      console.log('down');
      this.handleMonitorCallback('down', res, monitor);
    });

    monitor.on('error', (error: any) => {
      console.error('An error occurred:', error);
    });

    this.monitors[url.id] = monitor;

    return monitor;
  }

  update(url: Url) {
    const monitor = this.monitors[url.id];
    monitor.stop();
    const httpHeaders = this.getUrlHttpHeaders(url);
    monitor.website = url.url;
    monitor.title = url.name;
    monitor.port = url.port;
    monitor.protocol = url.protocol.toLowerCase();
    monitor.interval = url.interval;
    monitor.timeout = url.timeout;
    monitor.ignoreSSL = url.ignoreSSL;
    monitor.httpOptions = {
      path: url.path,
      headers: Object.entries(httpHeaders).map(([key, value]) => ({
        [key]: value,
      })),
    };
    monitor.expect = {
      statusCode: url.assert?.statusCode ?? 200,
    };
    monitor.resume();
    this.monitors[url.id] = monitor;
  }

  delete(urlId: string) {
    const monitor = this.monitors[urlId];
    monitor.stop();
    delete this.monitors[urlId];
  }

  private getUrlHttpHeaders(url: Url) {
    const httpHeaders = url.httpHeaders ?? {};
    if (url.authentication) {
      httpHeaders['Authorization'] = `Basic ${Buffer.from(
        `${url.authentication.username}:${url.authentication.password}`,
      ).toString('base64')}`;
    }
    return httpHeaders;
  }

  private handleMonitorCallback(state: string, res: any, monitor: Monitor) {
    monitor.log = {
      timestamp: new Date(),
      responseTime: res.responseTime,
      status: state,
    };
    monitor.responseTime = res.responseTime;
    this.reportsService.save(monitor);
  }
}
