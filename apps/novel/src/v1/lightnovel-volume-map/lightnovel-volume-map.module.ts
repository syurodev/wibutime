import { Module } from '@nestjs/common';
import { LightnovelVolumeMapController } from './lightnovel-volume-map.controller';
import { LightnovelVolumeMapService } from './lightnovel-volume-map.service';

@Module({
    imports: [],
    controllers: [LightnovelVolumeMapController],
    providers: [LightnovelVolumeMapService],
    exports: [],
})
export class LightnovelVolumeMapModule {}
