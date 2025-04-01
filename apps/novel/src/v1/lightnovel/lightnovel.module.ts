import { Module } from '@nestjs/common';

import { LightnovelController } from './lightnovel.controller';
import { LightnovelService } from './lightnovel.service';

@Module({
    imports: [],
    controllers: [LightnovelController],
    providers: [LightnovelService],
    exports: [],
})
export class LightnovelModule {}
