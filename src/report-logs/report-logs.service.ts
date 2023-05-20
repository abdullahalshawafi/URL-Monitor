import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/models';
import { Repository } from 'typeorm';
import { LogType } from './types/Log';

@Injectable()
export class ReportLogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async create(reportId: string, log: LogType) {
    const newLog = this.logRepository.create({ ...log, reportId });
    return await this.logRepository.save(newLog);
  }
}
