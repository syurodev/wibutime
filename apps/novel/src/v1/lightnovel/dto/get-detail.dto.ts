import { IsInt, IsNotEmpty } from 'class-validator';

export class GetDetailDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
