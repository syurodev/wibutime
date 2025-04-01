import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoreProcedureUtil } from '@workspace/commons';
import { SPNovelDetail } from 'src/common/interfaces/novels/sp-novel-detail';
import { Lightnovel } from '../entities/lightnovel.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class LightnovelRepository extends BaseRepository<Lightnovel> {
  constructor(
    @InjectRepository(Lightnovel)
    private readonly lightnovelRepository: Repository<Lightnovel>,
  ) {
    super(lightnovelRepository);
  }

  async getSummary(id: number) {
    return await this.lightnovelRepository
      .createQueryBuilder('ln')
      .leftJoin('authors', 'author', 'author.id = ln.author')
      .leftJoin('artists', 'artist', 'artist.id = ln.artist')
      .leftJoin('lightnovel_genre_maps', 'map', 'map.novel_id = ln.id')
      .leftJoin('genres', 'genre', 'genre.id = map.genre_id')
      .where('ln.id = :id', { id })
      .select([
        'ln.id AS id',
        'ln.title AS title',
        'ln.cover_image_url AS cover_image_url',
        'author.id AS author_id',
        'author.name AS author_name',
        'artist.id AS artist_id',
        'artist.name AS artist_name',
        'array_agg(genre.id) AS genre_ids',
        'array_agg(genre.name) AS genre_names',
      ])
      .groupBy('ln.id, author.id, artist.id')
      .getRawOne();
  }

  async getDetail(id: number): Promise<SPNovelDetail> {
    const result = new StoreProcedureUtil(
      await this.lightnovelRepository.query(
        `CALL get_novel_detail($1, $2, $3, $4)`,
        [id, null, 0, ''],
      ),
    );

    return result.getResult();
  }

  async getSummaryWithPagination({
    user_id,
    author_id,
    artist_id,
    status,
    type,
    key_search,
    page,
    limit,
  }: {
    user_id: number;
    author_id: number;
    artist_id: number;
    status: number;
    type: number;
    key_search: string;
    page: number;
    limit: number;
  }) {
    const result = new StoreProcedureUtil(
      await this.lightnovelRepository.query(
        `CALL get_summary_novels_with_pagination($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          user_id,
          author_id,
          artist_id,
          status,
          type,
          key_search ?? '',
          page,
          limit,
          null,
          null,
          0,
          '',
        ],
      ),
    );

    return {
      items: result.getResult(),
      total: result.getTotalRecord(),
      page,
      limit,
      totalPages: Math.ceil(result.getTotalRecord() / limit),
    };
  }

  async getTop(type: number, limit: number) {
    return new StoreProcedureUtil(
      await this.lightnovelRepository.query(
        `CALL get_top_novels($1, $2, $3, $4, $5)`,
        [type, limit, null, 0, ''],
      ),
    ).getResult();
  }
}
