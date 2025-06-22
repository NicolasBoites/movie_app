import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username: string;
  
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  // @MinLength(8)
  // @MaxLength(30)
  password: string;
}
