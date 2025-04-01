import { Injectable } from '@nestjs/common';
import { Chapter } from '../entities/chapter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ChapterRepository extends BaseRepository<Chapter> {
    constructor(
        @InjectRepository(Chapter)
        private readonly chapterRepository: Repository<Chapter>,
    ) {
        super(chapterRepository);
    }
}
