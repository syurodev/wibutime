import { Injectable } from '@nestjs/common';
import { BookmarkRepository } from '../../data/repositories/bookmark.repository';

@Injectable()
export class BookmarkService {
    constructor(private readonly bookmarkRepository: BookmarkRepository) {}
}
