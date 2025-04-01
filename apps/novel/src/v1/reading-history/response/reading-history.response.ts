import { TimeUtil } from '@syurodev/ts-common';
import { GenerateUrl } from '@workspace/commons';
import { SpUserHistory } from 'src/common/interfaces/history/sp-user-history';
import { ReadingHistoryChapterResponse } from './reading-history-chapter.response';

export class ReadingHistoryResponse {
  id: number;
  title: string;
  cover_image_url: string;
  last_seen_at: string;
  content: ReadingHistoryChapterResponse;

  constructor(readingHistory?: SpUserHistory) {
    if (readingHistory) {
      this.id = readingHistory.id;
      this.title = readingHistory.title;
      this.cover_image_url = new GenerateUrl(
        readingHistory.cover_image_url,
      ).getMediaUrl();
      this.last_seen_at = new TimeUtil(
        readingHistory.last_read_at,
      ).convertToClientDate();
      this.content = new ReadingHistoryChapterResponse(readingHistory.chapter);
    }
  }

  public mapToList(data: SpUserHistory[]) {
    return data.map((item) => new ReadingHistoryResponse(item));
  }
}
