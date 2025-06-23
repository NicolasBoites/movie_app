import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user', example: '60c72b2f9b1d8e001c8a1b2d' })
  id: string;

  @ApiProperty({ description: 'Username of the user', example: 'jane.doe' })
  username: string;

  @ApiProperty({ description: 'Email address of the user', example: 'jane.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'List of favorite movie IDs for the user', example: ['60c72b2f9b1d8e001c8a1b2e', '60c72b2f9b1d8e001c8a1b2f'] })
  favoriteMovieIds: string[];
  
}