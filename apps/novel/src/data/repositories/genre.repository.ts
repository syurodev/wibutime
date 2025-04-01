import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Genre } from '../entities/genre.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class GenreRepository extends BaseRepository<Genre> {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
    ) {
        super(genreRepository);
    }
}
