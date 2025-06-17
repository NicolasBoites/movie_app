import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'The email must be valid'})
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  //@MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
