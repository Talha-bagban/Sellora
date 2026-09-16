import { IsInt, Min } from 'class-validator';

export class UpdateImageOrderDto {
  @IsInt()
  @Min(0)
  sortOrder: number;
}