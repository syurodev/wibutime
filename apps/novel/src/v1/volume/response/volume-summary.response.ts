import { TimeUtil } from '@syurodev/ts-common';
import { GenerateUrl } from '@workspace/commons';
import { SPNovelDetail } from 'src/common/interfaces/novels/sp-novel-detail';

export class VolumeSummaryResponse {
  id: number;
  title: string;
  cover_image_url: string;
  volume_number: number;
  word_count: number;
  release_date: string;
  synopsis: string;
  chapters?: {
    id: number;
    index: number;
    title: string;
    status: number;
    created_at: string;
  }[];

  constructor(init?: any) {
    this.id = init?.id ?? 0;
    this.title = init?.title ?? '';
    this.cover_image_url = new GenerateUrl(
      init?.cover_image ?? '',
    ).getMediaUrl();
    this.volume_number = init?.volume_number ?? 0;
    this.word_count = init?.word_count ?? 0;
    this.release_date = init?.release_date
      ? new TimeUtil(init?.release_date).convertToClientDateTime()
      : '';
    this.synopsis = init?.synopsis ?? '';
    this.chapters = init?.chapters;
  }

  static fromStoreGetNovelDetail(
    data: SPNovelDetail['volumes'],
  ): VolumeSummaryResponse[] {
    return data.map(
      (item: any) =>
        new VolumeSummaryResponse({
          id: item.id,
          title: item.title,
          cover_image: item.cover_image_url,
          volume_number: item.volume_number,
          release_date: item.release_date,
          chapters: item.chapters,
          synopsis: item.synopsis,
          word_count: item.word_count,
        }),
    );
  }
}
