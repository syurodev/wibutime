import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProcedureUtil } from '@workspace/commons';
import { Repository } from 'typeorm';
import { ReadingHistory } from '../entities/reading-history.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class ReadingHistoryRepository extends BaseRepository<ReadingHistory> {
  constructor(
    @InjectRepository(ReadingHistory)
    private readonly readingHistoryRepository: Repository<ReadingHistory>,
  ) {
    super(readingHistoryRepository);
  }

  async getUserHistories(userId: number, page: number, limit: number) {
    const result = new StoreProcedureUtil(
      await this.readingHistoryRepository.query(
        `CALL sp_g_reading_histories($1, $2, $3, $4, $5, $6, $7)`,
        [userId, page, limit, null, 0, 0, ''],
      ),
    );

    return result;
  }
}
