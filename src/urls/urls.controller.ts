import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dtos/create-url.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';
import { UpdateUrlDto } from './dtos/uptdate-url.dto';

@UseGuards(AuthGuard)
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UsePipes(ValidationPipe)
  @Post('create')
  async createUrl(
    @Body() body: CreateUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.urlsService.createUrl(body, req.user.id);
  }

  @Get()
  async getAllUrls(@Req() req: AuthenticatedRequest) {
    return await this.urlsService.find(req.user.id);
  }

  @Get(':slugOrId')
  async getUrlBySlugOrId(
    @Param('slugOrId') slugOrId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const isUUID = slugOrId.match(
      /[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}/,
    );

    const filter = { [isUUID ? 'id' : 'slug']: slugOrId };

    const url = await this.urlsService.findOne(filter, req.user.id);
    if (!url) {
      throw new HttpException(
        `Url with ${isUUID ? 'id' : 'slug'} "${slugOrId}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return url;
  }

  @UsePipes(ValidationPipe)
  @Put('update/:slugOrId')
  async updateUrl(
    @Param('slugOrId') slugOrId: string,
    @Body() body: UpdateUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!slugOrId) {
      throw new HttpException(
        `Invalid params "${slugOrId}"`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Object.keys(body).length) {
      throw new HttpException(`Invalid empty`, HttpStatus.BAD_REQUEST);
    }

    const isUUID = slugOrId.match(
      /[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}/,
    );

    const filter = { [isUUID ? 'id' : 'slug']: slugOrId };

    const url = await this.urlsService.findOne(filter, req.user.id);
    if (!url) {
      throw new HttpException(
        `Url with ${isUUID ? 'id' : 'slug'} "${slugOrId}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUrl = await this.urlsService.update(url.id, body, req.user.id);
    if (!updatedUrl) {
      throw new HttpException(
        `Unable to update url with ${isUUID ? 'id' : 'slug'} "${slugOrId}"`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: `Url with ${
        isUUID ? 'id' : 'slug'
      } "${slugOrId}" updated successfully`,
      data: updatedUrl,
    };
  }

  @Delete('delete/:slugOrId')
  async deleteUrl(
    @Param('slugOrId') slugOrId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!slugOrId) {
      throw new HttpException(
        `Invalid params "${slugOrId}"`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isUUID = slugOrId.match(
      /[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}/,
    );

    const filter = { [isUUID ? 'id' : 'slug']: slugOrId };

    const url = await this.urlsService.findOne(filter, req.user.id);
    if (!url) {
      throw new HttpException(
        `Url with ${isUUID ? 'id' : 'slug'} "${slugOrId}" not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const deleteResult = await this.urlsService.delete(url.id, req.user.id);
    if (!deleteResult) {
      throw new HttpException(
        `Unable to delete url with ${isUUID ? 'id' : 'slug'} "${slugOrId}"`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: `Url with ${
        isUUID ? 'id' : 'slug'
      } "${slugOrId}" deleted successfully`,
    };
  }
}
