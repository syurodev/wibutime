import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { BaseResponse } from '@workspace/commons';
import { TOP_TYPE } from '@workspace/types';
import { Response } from 'express';
import { LightnovelService } from './lightnovel.service';
import { BaseLightNovelResponse } from './response/lightnovel-detail.response';
import { LightnovelSummaryResponse } from './response/lightnovel-summary.response';
import { TopNovelResponse } from './response/top.response';

@Controller('novels')
export class LightnovelController {
  constructor(private readonly lightnovelService: LightnovelService) {}

  @Get('/top')
  async getTop(
    @Query()
    query: {
      limit: number;
      type: TOP_TYPE;
    },
    @Res() res: Response,
  ) {
    const response: BaseResponse<any> = new BaseResponse<any>();

    const result = await this.lightnovelService.getTop(query.type, query.limit);

    response.setData(TopNovelResponse.fromRawResponse(result));

    return res.status(HttpStatus.OK).send(response);
  }

  @Get('/:id/summary')
  async getSummary(@Param('id') id: number, @Res() res: Response) {
    const response: BaseResponse<any> = new BaseResponse<any>();

    const result = await this.lightnovelService.getSummary(id);

    response.setData(LightnovelSummaryResponse.fromRawResponse(result));
    return res.status(HttpStatus.OK).send(response);
  }

  @Get('/:id/detail')
  async getDetail(@Param('id') id: number, @Res() res: Response) {
    const response: BaseResponse<any> = new BaseResponse<any>();

    const result = await this.lightnovelService.getDetail(id);

    response.setData(BaseLightNovelResponse.fromRawResponse(result));
    return res.status(HttpStatus.OK).send(response);
  }

  @Get('/')
  async getList(
    @Query()
    query: {
      user_id: number;
      author_id: number;
      artist_id: number;
      status: number;
      type: number;
      key_search: string;
      page: number;
      limit: number;
    },
    @Res() res: Response,
  ) {
    const response: BaseResponse<any> = new BaseResponse<any>();

    const result = await this.lightnovelService.getSummaryWithPagination({
      user_id: +query.user_id || -1,
      author_id: +query.author_id || -1,
      artist_id: +query.artist_id || -1,
      status: +query.status || -1,
      type: +query.type || -1,
      key_search: query.key_search ?? '',
      page: Number(query.page || 1),
      limit: Number(query.limit || 20),
    });

    response.setData(LightnovelSummaryResponse.fromRawResponse(result.items));
    response.setLimit(Number(query.limit || 20));
    response.setTotalRecord(result.total);

    return res.status(HttpStatus.OK).send(response);
  }
}
