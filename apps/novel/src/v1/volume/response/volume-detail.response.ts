import { TimeUtil } from '@syurodev/ts-common';
import {
    ChapterSummaryRaw,
    ChapterSummaryResponse,
} from '../../chapter/response/chapter-summary.response';

type VolumeDetailRaw = {
    id: number;
    title: string;
    volume_number: number;
    cover_image: string;
    release_date: Date | null;
    synopsis: string | null;
    word_count: string;
    chapters: Array<ChapterSummaryRaw>;
};

export class VolumeDetailResponse {
    id: number;
    title: string;
    cover_image_url: string;
    volume_number: number;
    release_date: string;
    synopsis: string;
    word_count: number;
    chapters: Array<ChapterSummaryResponse>;

    constructor(init?: VolumeDetailRaw) {
        this.id = init?.id;
        this.title = init?.title;
        this.cover_image_url = init?.cover_image ?? '';
        this.volume_number = init?.volume_number ?? 0;
        this.release_date = init?.release_date
            ? new TimeUtil(init?.release_date).convertToClientDateTime()
            : '';
        this.synopsis = init?.synopsis ?? '';
        this.word_count = init?.word_count ? +init?.word_count : 0;
        this.chapters = ChapterSummaryResponse.fromQueryBuilderGetVolumeDetail(
            init?.chapters,
        );
    }
}
