import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { DailyView } from '../entities/daily-view.entity';

@Injectable()
export class DailyViewRepository extends BaseRepository<DailyView> {
    constructor(
        @InjectRepository(DailyView)
        private readonly dailyViewRepository: Repository<DailyView>,
    ) {
        super(dailyViewRepository);
    }
}
