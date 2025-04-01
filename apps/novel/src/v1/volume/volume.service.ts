import { Injectable } from '@nestjs/common';
import { VolumeRepository } from '../../data/repositories/volume.repository';

@Injectable()
export class VolumeService {
    constructor(private readonly volumeRepository: VolumeRepository) {}

    async getDetail(id: number) {
        return await this.volumeRepository.getDetail(id);
    }
}
