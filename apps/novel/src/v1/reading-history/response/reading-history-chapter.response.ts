import { SpUserHistory } from 'src/common/interfaces/history/sp-user-history';

export class ReadingHistoryChapterResponse {
  id: number;
  index: number;
  title: string;
  status: number;
  bookmark_line: string;

  constructor(readingHistory?: SpUserHistory['chapter']) {
    if (readingHistory) {
      this.id = readingHistory.id;
      this.index = readingHistory.index;
      this.title = readingHistory.title;
      this.status = readingHistory.status;
      this.bookmark_line = readingHistory.bookmark_line;
    }
  }

  static mapToList(data: SpUserHistory['chapter'][]) {
    return data.map((item) => new ReadingHistoryChapterResponse(item));
  }
}
