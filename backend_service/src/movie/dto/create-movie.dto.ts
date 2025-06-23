import { IsNotEmpty, IsString, IsNumber, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ description: 'The title of the movie', example: 'Inception' })
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @Matches(/^\S.*\S$|^\S$/, {
    message: 'There should be no blank spaces at the beginning or end.',
  })
  title: string;

  @ApiProperty({ description: 'The rank of the movie (1-10)', example: 9 })
  @IsNumber({}, { message: 'Rank must be a number' })
  @Min(1, { message: 'Rank must be at least 1' })
  @IsNotEmpty({ message: 'Rank must not be empty' })
  rank: number;

  @ApiProperty({ description: 'The genre of the movie', example: 'Sci-Fi' })
  @IsString()
  @IsNotEmpty({ message: 'Genre must not be empty' })
  @Matches(/^\S.*\S$|^\S$/, {
    message: 'There should be no blank spaces at the beginning or end.',
  })
  genre: string;
}