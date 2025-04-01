import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class FavoriteRepository extends BaseRepository<Favorite> {
    constructor(
        @InjectRepository(Favorite)
        private readonly favoriteRepository: Repository<Favorite>,
    ) {
        super(favoriteRepository);
    }
}
