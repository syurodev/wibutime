import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../entities/artist.entity';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ArtistRepository extends BaseRepository<Artist> {
    constructor(
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>,
    ) {
        super(artistRepository);
    }
}
