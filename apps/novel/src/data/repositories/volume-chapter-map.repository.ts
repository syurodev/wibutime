import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolumeChapterMap } from '../entities/volume-chapter-map.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class VolumeChapterMapRepository extends BaseRepository<VolumeChapterMap> {
    constructor(
        @InjectRepository(VolumeChapterMap)
        private readonly volumeChapterRepository: Repository<VolumeChapterMap>,
    ) {
        super(volumeChapterRepository);
    }
}
