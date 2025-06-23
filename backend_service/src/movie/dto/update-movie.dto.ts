import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({ description: 'Optional: Updated title of the movie', example: 'Inception 2', required: false })
  title?: string;

  @ApiProperty({ description: 'Optional: Updated rank of the movie', example: 10, required: false })
  rank?: number;

  @ApiProperty({ description: 'Optional: Updated genre of the movie', example: 'Thriller', required: false })
  genre?: string;
}