import { Module } from '@nestjs/common';

import { VolumeController } from './volume.controller';
import { VolumeService } from './volume.service';

@Module({
    imports: [],
    controllers: [VolumeController],
    providers: [VolumeService],
    exports: [],
})
export class VolumeModule {}
