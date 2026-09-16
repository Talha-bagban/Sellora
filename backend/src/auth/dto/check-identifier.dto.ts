import { IsNotEmpty, IsString } from 'class-validator';

export class CheckIdentifierDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
}