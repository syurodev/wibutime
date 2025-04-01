import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetListLightNovelDTO {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 100;

  @IsOptional()
  @IsString()
  key_search: string = '';

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  status: number = -1;

  @IsOptional()
  @IsString()
  category_ids: string = '';

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  artist_id: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  author_id: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  type: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  user_id: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  order_by?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn([0, 1]) // 0: ASC, 1: DESC
  order_direction?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn([0, 1]) // 0: Not Favorite, 1: Favorite, -1: All
  is_favorite: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn([0, 1]) // 0: Not Following, 1: Following, -1: All
  is_follow_author: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn([0, 1]) // 0: Not Following, 1: Following, -1: All
  is_follow_artist: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn([0, 1]) // 0: Not Following, 1: Following, -1: All
  is_follow_category: number = -1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn([0, 1]) // 0: Not Following, 1: Following, -1: All
  is_follow_user: number = -1;
}
