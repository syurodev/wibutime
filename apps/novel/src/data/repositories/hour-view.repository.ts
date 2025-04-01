import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { HourView } from '../entities/hour-view.entity';

@Injectable()
export class HourViewRepository extends BaseRepository<HourView> {
    constructor(
        @InjectRepository(HourView)
        private readonly hourViewRepository: Repository<HourView>,
    ) {
        super(hourViewRepository);
    }
}
