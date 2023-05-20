import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':urlId')
  async getReportByUrlId(
    @Param('urlId') urlId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const report = await this.reportsService.findOne(urlId, req.user.id);
    if (!report) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
    return report;
  }

  @Get('tags/:tag')
  async getReportsByTag(
    @Param('tag') tag: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const reports = await this.reportsService.findByTag(tag, req.user.id);
    if (!reports) {
      throw new HttpException('Reports not found', HttpStatus.NOT_FOUND);
    }
    return reports;
  }
}
