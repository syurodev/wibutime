import { Module } from '@nestjs/common';

import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

@Module({
    imports: [],
    controllers: [ChapterController],
    providers: [ChapterService],
    exports: [],
})
export class ChapterModule {}
