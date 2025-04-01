import { Column, Entity } from 'typeorm';
import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';

@Entity({ name: 'favorites' })
export class Favorite extends TypeOrmBaseEntity {
    @Column({ name: 'user_id', type: 'bigint', nullable: false })
    user_id: number;

    @Column({ name: 'novel_id', type: 'bigint', nullable: false })
    novel_id: number;
}
