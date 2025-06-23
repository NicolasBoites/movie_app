import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create_user.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Optional: New username for the user', example: 'new.john.doe', required: false })
  username?: string;

  @ApiProperty({ description: 'Optional: New email for the user', example: 'new.john.doe@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Optional: New password for the user', example: 'NewSecureP@ssw0rd!', required: false })
  password?: string;

  @ApiProperty({ description: 'Optional: The refresh token for the user session', required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}