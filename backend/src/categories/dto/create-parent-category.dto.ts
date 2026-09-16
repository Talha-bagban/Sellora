import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParentCategoryDto {
  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}