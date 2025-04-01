import { GenerateUrl } from '@workspace/commons';
import {
  AuthorOrArtist,
  SPNovelDetail,
} from 'src/common/interfaces/novels/sp-novel-detail';
import { EditorContent } from '../../../common/interfaces/editor';
import { GenreResponse } from '../../genre/response/response';
import { VolumeSummaryResponse } from '../../volume/response/volume-summary.response';

export class BaseLightNovelResponse {
  id: number;
  title: string;
  cover_image_url: string;
  summary: EditorContent[];
  author: AuthorOrArtist;
  artist: AuthorOrArtist;
  status: number;
  genres: GenreResponse[];
  type: number;
  alternative_names: string[];
  word_count: number;
  volumes: VolumeSummaryResponse[];
  user: any;

  constructor(
    id: number,
    title: string,
    cover_image_url: string,
    summary: EditorContent[],
    author: AuthorOrArtist,
    artist: AuthorOrArtist,
    status: number,
    genres: GenreResponse[],
    type: number,
    alternative_names: string[],
    word_count: number,
    volumes: VolumeSummaryResponse[],
  ) {
    this.id = id;
    this.title = title;
    this.cover_image_url = new GenerateUrl(cover_image_url).getMediaUrl();
    this.summary = summary;
    this.author = author;
    this.artist = artist;
    this.status = status;
    this.genres = genres;
    this.type = type;
    this.alternative_names = alternative_names;
    this.word_count = word_count;
    this.volumes = volumes;
    this.user = {
      id: 1,
      nick_name: 'Syuro',
      avatar: '',
    };
  }

  static fromRawResponse(data: SPNovelDetail) {
    return new BaseLightNovelResponse(
      data.id,
      data.title,
      data.cover_image_url,
      data.summary,
      data.author,
      data.artist,
      data.status,
      data.genres,
      data.type,
      data.alternative_names,
      +data.word_count,
      VolumeSummaryResponse.fromStoreGetNovelDetail(data.volumes),
    );
  }
}
