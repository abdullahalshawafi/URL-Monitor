import { Module } from '@nestjs/common';
import { ReportLogsService } from './report-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/models';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [ReportLogsService],
})
export class ReportLogsModule {}
