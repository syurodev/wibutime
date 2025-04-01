import { Injectable } from '@nestjs/common';
import { ReadingHistoryRepository } from '../../data/repositories/reading_history.repository';

@Injectable()
export class ReadingHistoryService {
  constructor(
    private readonly readingHistoryRepository: ReadingHistoryRepository,
  ) {}

  async getUserHistories(userId: number, page: number, limit: number) {
    return await this.readingHistoryRepository.getUserHistories(
      userId,
      page,
      limit,
    );
  }
}
