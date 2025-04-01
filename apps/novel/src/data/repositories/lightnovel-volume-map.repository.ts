import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LightnovelVolumeMap } from '../entities/lightnovel-volume-map.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class LightnovelVolumeMapRepository extends BaseRepository<LightnovelVolumeMap> {
    constructor(
        @InjectRepository(LightnovelVolumeMap)
        private readonly lightnovelVolumeMapRepository: Repository<LightnovelVolumeMap>,
    ) {
        super(lightnovelVolumeMapRepository);
    }
}
