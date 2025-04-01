import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { YearlyView } from '../entities/yearly-view.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class YearlyViewRepository extends BaseRepository<YearlyView> {
  constructor(
    @InjectRepository(YearlyView)
    private readonly yearlyViewRepository: Repository<YearlyView>,
  ) {
    super(yearlyViewRepository);
  }
}
