import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Bookmark } from '../entities/bookmark.entity';

@Injectable()
export class BookmarkRepository extends BaseRepository<Bookmark> {
    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>,
    ) {
        super(bookmarkRepository);
    }
}
