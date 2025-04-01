import { Injectable } from '@nestjs/common';

import { LightnovelRepository } from '../../data/repositories/lightnovel.repository';
import { Lightnovel } from '../../data/entities/lightnovel.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class LightnovelService {
    constructor(private readonly lightnovelRepository: LightnovelRepository) {}

    async findOne(option: FindOptionsWhere<Lightnovel>): Promise<Lightnovel> {
        return await this.lightnovelRepository.findOne(option);
    }

    async getSummary(id: number) {
        return await this.lightnovelRepository.getSummary(id);
    }

    async getDetail(id: number) {
        return await this.lightnovelRepository.getDetail(id);
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
        return await this.lightnovelRepository.getSummaryWithPagination({
            user_id,
            author_id,
            artist_id,
            status,
            type,
            key_search,
            page,
            limit,
        });
    }

    async getTop(type: number, limit: number) {
        return await this.lightnovelRepository.getTop(type, limit);
    }
}
