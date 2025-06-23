import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The unique username for the user', example: 'john.doe' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username: string;

  @ApiProperty({ description: 'The user\'s email address', example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'The email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string;

  @ApiProperty({ description: 'The user\'s password', example: 'SecureP@ssw0rd!' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  // @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Uncomment if you add these validations
  // @MaxLength(30, { message: 'Password cannot exceed 30 characters' })
  password: string;
}