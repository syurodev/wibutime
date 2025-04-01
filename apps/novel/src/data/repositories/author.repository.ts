import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from '../entities/author.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class AuthorRepository extends BaseRepository<Author> {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
    ) {
        super(authorRepository);
    }
}
