import { Module } from '@nestjs/common';
import { LightnovelGenreMapController } from './lightnovel-genre-map.controller';
import { LightnovelGenreMapService } from './lightnovel-genre-map.service';

@Module({
    imports: [],
    controllers: [LightnovelGenreMapController],
    providers: [LightnovelGenreMapService],
    exports: [],
})
export class LightnovelGenreMapModule {}
