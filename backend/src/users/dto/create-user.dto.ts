import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
 @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[0-9]{10})$/,
    {
      message: 'Identifier must be a valid email or 10-digit phone number',
    },
  )
  identifier: string;

  @MinLength(6)
  password: string;
}