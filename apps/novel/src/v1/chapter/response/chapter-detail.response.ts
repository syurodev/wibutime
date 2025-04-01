import { TimeUtil } from '@syurodev/ts-common';
import { Chapter } from '../../../data/entities/chapter.entity';
import { EditorContent } from '../../../common/interfaces/editor';

export class ChapterSummaryResponse {
    id: number;
    title: string;
    index: number;
    status: number;
    content: EditorContent[];
    created_at: string;
    updated_at: string;

    constructor(init?: Chapter) {
        this.id = init?.id ?? 0;
        this.title = init?.title ?? '';
        this.index = init?.index ?? 0;
        this.status = init?.status ?? 0;
        this.content = (init?.content as any) ?? [];
        this.created_at = new TimeUtil(
            init.createdAt,
        ).convertToClientDateTime();
        this.updated_at = new TimeUtil(
            init.updatedAt,
        ).convertToClientDateTime();
    }
}
