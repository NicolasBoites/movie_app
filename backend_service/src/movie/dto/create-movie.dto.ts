import { IsNotEmpty, IsString, IsNumber, Min, Matches } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @Matches(/^\S.*\S$|^\S$/, {
    message: 'There should be no blank spaces at the beginning or end.',
  })
  title: string;

  @IsNumber()
  rank: number;

  @IsString()
  @IsNotEmpty({ message: 'Genre must not be empty' })
  @Matches(/^\S.*\S$|^\S$/, {
    message: 'There should be no blank spaces at the beginning or end.',
  })
  genre: string;
}
