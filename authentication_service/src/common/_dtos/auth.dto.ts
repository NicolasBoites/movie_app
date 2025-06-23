import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: 'The user\'s email address', example: 'user@example.com' })
  @IsEmail({}, { message: 'The email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string;

  @ApiProperty({ description: 'The user\'s password', example: 'SecureP@ss123' })
  @IsNotEmpty({ message: 'Password is required' })
  // @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}