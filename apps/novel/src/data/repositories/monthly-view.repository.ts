import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { MonthlyView } from '../entities/monthly-view.entity';

@Injectable()
export class MonthlyViewRepository extends BaseRepository<MonthlyView> {
    constructor(
        @InjectRepository(MonthlyView)
        private readonly monthlyViewRepository: Repository<MonthlyView>,
    ) {
        super(monthlyViewRepository);
    }
}
