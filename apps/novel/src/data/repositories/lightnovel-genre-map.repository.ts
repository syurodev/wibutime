import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LightnovelGenreMap } from '../entities/lightnovel-genre-map.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class LightnovelGenreMapRepository extends BaseRepository<LightnovelGenreMap> {
    constructor(
        @InjectRepository(LightnovelGenreMap)
        private readonly lightnovelGenreRepository: Repository<LightnovelGenreMap>,
    ) {
        super(lightnovelGenreRepository);
    }
}
