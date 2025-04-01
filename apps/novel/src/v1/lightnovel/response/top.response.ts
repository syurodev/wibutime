import { TimeUtil } from '@syurodev/ts-common';
import { GenerateUrl } from '@workspace/commons';
import { CONTENT_TYPE } from '@workspace/types';
import { EditorContent } from 'src/common/interfaces/editor';
import { ArtistResponse } from 'src/v1/artist/response/response';
import { AuthorResponse } from 'src/v1/author/response/response';
import { GenreResponse } from 'src/v1/genre/response/response';

export class TopNovelResponse {
  id: number;
  type: CONTENT_TYPE;
  title: string;
  cover_image_url: string;
  latest_chapter_date: string;
  views: number;
  average_score: number;
  vote_count: number;
  author: AuthorResponse;
  artist: ArtistResponse;
  genres: GenreResponse[];
  summary: EditorContent[];
  content: {
    id: number;
    index: number;
    title: string;
    created_at: string;
  } | null;

  constructor(init: any) {
    this.id = init?.id ?? 0;
    this.title = init?.title ?? '';
    this.cover_image_url = init?.cover_image_url
      ? new GenerateUrl(init.cover_image_url).getMediaUrl()
      : '';
    this.author = init?.author_id
      ? new AuthorResponse(init.author_id, init.author_name)
      : null;
    this.artist = init?.artist_id
      ? new ArtistResponse(init.artist_id, init.artist_name)
      : null;
    this.genres = init?.genres ? GenreResponse.mapToList(init.genres) : [];
    this.average_score = init?.average_score ?? 0;
    this.vote_count = init?.vote_count ?? 0;
    this.latest_chapter_date = init?.latest_chapter_date
      ? new TimeUtil(init.latest_chapter_date).convertToClientDate()
      : '';
    this.views = init?.views ?? 0;
    this.summary = init?.summary ? init.summary : [];
    this.content = init?.latest_chapter?.id
      ? {
          id: init.latest_chapter.id,
          index: init.latest_chapter.index,
          title: init.latest_chapter.title,
          created_at: new TimeUtil(
            init.latest_chapter.created_at,
          ).convertToClientDate(),
        }
      : null;
    this.type = CONTENT_TYPE.NOVEL;
  }

  static fromRawResponse(response: any): TopNovelResponse | TopNovelResponse[] {
    if (Array.isArray(response)) {
      return response.map((x) => {
        return new TopNovelResponse(x);
      });
    } else {
      return new TopNovelResponse(response);
    }
  }
}
