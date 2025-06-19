import { ApiProperty } from '@nestjs/swagger';

export class FavoriteResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  id?: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'List of favorite movie IDs',
    example: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
    type: [String],
  })
  favoriteMovieIds: string[];

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2024-01-01T12:00:00.000Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    example: '2024-01-01T12:00:00.000Z',
    required: false,
  })
  updatedAt?: Date;
} 