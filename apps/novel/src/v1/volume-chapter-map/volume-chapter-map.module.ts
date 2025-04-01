import { Module } from '@nestjs/common';
import { VolumeChapterMapController } from './volume-chapter-map.controller';
import { VolumeChapterMapService } from './volume-chapter-map.service';

@Module({
    imports: [],
    controllers: [VolumeChapterMapController],
    providers: [VolumeChapterMapService],
    exports: [],
})
export class VolumeChapterMapModule {}
