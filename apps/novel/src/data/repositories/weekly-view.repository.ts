import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WeeklyView } from '../entities/weekly-view.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class WeeklyViewRepository extends BaseRepository<WeeklyView> {
  constructor(
    @InjectRepository(WeeklyView)
    private readonly weeklyViewRepository: Repository<WeeklyView>,
  ) {
    super(weeklyViewRepository);
  }
}
