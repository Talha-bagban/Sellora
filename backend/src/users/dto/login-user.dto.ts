import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  identifier: string; // email OR phone

  @IsNotEmpty()
  password: string;
}