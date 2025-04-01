import { TimeUtil } from '@syurodev/ts-common';

export type ChapterSummaryRaw = {
    id: number;
    title: string;
    index: number;
    updated_at: Date;
};

export class ChapterSummaryResponse {
    id: number;
    title: string;
    index: number;
    updated_at: string;

    constructor(init?: ChapterSummaryRaw) {
        this.id = init?.id ?? 0;
        this.title = init?.title ?? '';
        this.index = init?.index ?? 0;
        this.updated_at = new TimeUtil(
            init.updated_at,
        ).convertToClientDateTime();
    }

    static fromQueryBuilderGetVolumeDetail(
        data: ChapterSummaryRaw[],
    ): ChapterSummaryResponse[] {
        return data.map((item: any) => new ChapterSummaryResponse(item));
    }
}
