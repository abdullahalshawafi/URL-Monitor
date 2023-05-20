import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from 'src/models';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dtos/create-url.dto';
import { UpdateUrlDto } from './dtos/uptdate-url.dto';
import { MonitorsService } from 'src/monitors/monitors.service';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class UrlsService implements OnModuleInit {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly reportsService: ReportsService,
    private readonly monitorsService: MonitorsService,
  ) {}

  async onModuleInit() {
    const urls = await this.urlRepository.findBy({ deletedAt: null });
    this.monitorsService.initializeMonitors(urls);
  }

  async createUrl(createUrlDto: CreateUrlDto, userId: string) {
    const slug = createUrlDto.name.trim().toLowerCase().replace(/\s+/g, '-');
    if (createUrlDto.tags) {
      createUrlDto.tags = [
        ...new Set(createUrlDto.tags.map((tag) => tag.toLowerCase())),
      ];
    }
    const newUrl = this.urlRepository.create({
      ...createUrlDto,
      slug,
      userId,
    });
    const url = await this.urlRepository.save(newUrl);
    await this.reportsService.create(url.id);
    this.monitorsService.create(url);
    return url;
  }

  async find(userId: string) {
    return await this.urlRepository.findBy({ userId, deletedAt: null });
  }

  async findAllUrlsForMonitors() {
    return await this.urlRepository.findBy({ deletedAt: null });
  }

  async findOne(filter: Record<string, string>, userId: string) {
    return await this.urlRepository.findOneBy({
      ...filter,
      userId,
      deletedAt: null,
    });
  }

  async update(id: string, updateUrlDto: UpdateUrlDto, userId: string) {
    const updateObj: Record<string, any> = { ...updateUrlDto };
    if (updateObj.name) {
      updateObj.slug = updateUrlDto.name
        ?.trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
    }

    await this.urlRepository.update(id, updateObj);

    const updatedUrl = await this.urlRepository.findOneBy({
      id,
      userId,
      deletedAt: null,
    });

    this.monitorsService.update(updatedUrl);

    return updatedUrl;
  }

  async delete(id: string, userId: string) {
    this.monitorsService.delete(id);
    return await this.urlRepository.softDelete({ id, userId });
  }
}
