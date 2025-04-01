import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { BaseResponse } from '@workspace/commons';
import { Response } from 'express';
import { ChapterService } from './chapter.service';
import { ChapterSummaryResponse } from './response/chapter-detail.response';

@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get('/:id/detail')
  async getDetail(@Param('id') id: number, @Res() res: Response) {
    const response: BaseResponse<any> = new BaseResponse<any>();

    const result = await this.chapterService.getDetail(id);

    response.setData(new ChapterSummaryResponse(result));
    return res.status(HttpStatus.OK).send(response);
  }

  @Post('/:id/viewed')
  async viewed(
    @Param('id') id: number,
    @Body() body: { novel_id: number },
    @Res() res: Response,
  ) {
    const response: BaseResponse<any> = new BaseResponse<any>();

    await this.chapterService.viewed(id, body.novel_id);

    return res.status(HttpStatus.OK).send(response);
  }
}
