import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Volume } from '../entities/volume.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class VolumeRepository extends BaseRepository<Volume> {
    constructor(
        @InjectRepository(Volume)
        private readonly volumeRepository: Repository<Volume>,
    ) {
        super(volumeRepository);
    }

    async getDetail(id: number) {
        return await this.volumeRepository
            .createQueryBuilder('vl')
            .leftJoin('volume_chapter_maps', 'vcm', 'vcm.volume_id = vl.id') // Join với VolumeChapterMap
            .leftJoin('chapters', 'ch', 'ch.id = vcm.chapter_id') // Join với Chapters
            .select([
                'vl.id AS id',
                'vl.title AS title',
                'vl.volume_number AS volume_number',
                'vl.cover_image AS cover_image',
                'vl.release_date AS release_date',
                'vl.synopsis AS synopsis',
                'SUM(ch.word_count) AS word_count', // Tổng số từ
                `JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', ch.id,
                    'title', ch.title,
                    'index', ch.index,
                    'updated_at', ch.updated_at
                )
            ) AS chapters`, // Nhóm danh sách chapter vào một mảng JSON
            ])
            .where('vl.id = :id', { id })
            .groupBy('vl.id') // Nhóm theo volume
            .getRawOne();
    }
}
