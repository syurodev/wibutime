import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { BaseResponse } from '@workspace/commons';
import { Response } from 'express';

import { User, UserInfo } from 'src/common/decorators/user.decorator';
import { SpUserHistory } from 'src/common/interfaces/history/sp-user-history';
import { PageLimitDTO } from '../../common/dto/page-limit.dto';
import { ReadingHistoryService } from './reading-history.service';
import { ReadingHistoryResponse } from './response/reading-history.response';

@Controller('reading-histories')
export class ReadingHistoryController {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}

  @Get('')
  async getReadingHistories(
    @Query() query: PageLimitDTO,
    @Res() res: Response,
    @User() user: UserInfo,
  ) {
    const response = new BaseResponse();
    response.setLimit(query.limit);

    if (!user.id) {
      response.setData([]);
      return res.status(HttpStatus.OK).send(response);
    }

    const result = await this.readingHistoryService.getUserHistories(
      +user.id,
      query.page ?? 1,
      query.limit ?? 20,
    );

    response.setTotalRecord(result.getTotalRecord());
    response.setData(
      new ReadingHistoryResponse().mapToList(
        result.getResult<SpUserHistory[]>(),
      ),
    );
    return res.status(HttpStatus.OK).send(response);
  }
}
