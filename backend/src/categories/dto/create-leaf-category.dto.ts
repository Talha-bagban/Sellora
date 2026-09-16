import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLeafCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsUUID()
  subCategoryId: string;
}