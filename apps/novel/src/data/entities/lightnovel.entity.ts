import { TypeOrmBaseEntity } from '@syurodev/nestjs-common';
import { Column, Entity } from 'typeorm';

@Entity('lightnovels')
export class Lightnovel extends TypeOrmBaseEntity {
  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'author_id', type: 'int', default: 0 })
  author: number;

  @Column({ name: 'artist_id', type: 'int', default: 0 })
  artist: number;

  @Column({ type: 'smallint', default: 0 })
  status: number;

  @Column({ type: 'smallint', default: 0 })
  type: number;

  @Column({ name: 'average_score', type: 'float', default: 0 })
  average_score: number;

  @Column({ name: 'vote_count', type: 'int', default: 0 })
  vote_count: number;

  @Column('text', { array: true, name: 'alternative_names', default: [] })
  alternative_names: string[];

  @Column('jsonb', { default: [] })
  summary: Array<{
    id: string;
    type: string;
    children: Array<{ text: string; italic?: boolean; bold?: boolean }>;
  }>;

  @Column({ name: 'cover_image_url', default: '' })
  cover_image_url: string;

  /**
   * Returns a summary object including id, title, resource_id, and cover_image_url.
   */
  getSummary() {
    return {
      id: this.id,
      title: this.title,
      cover_image_url: this.cover_image_url,
    };
  }
}
