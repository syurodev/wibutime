import { Module } from '@nestjs/common';

import { ReadingHistoryController } from './reading-history.controller';
import { ReadingHistoryService } from './reading-history.service';

@Module({
    imports: [],
    controllers: [ReadingHistoryController],
    providers: [ReadingHistoryService],
    exports: [],
})
export class ReadingHistoryModule {}
