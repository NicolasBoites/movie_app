import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MovieService } from '../service/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const movies = await this.movieService.findAll();
    return {
      message: 'Movies found successfully',
      data: movies,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const movie = await this.movieService.findOne(id);
    return {
      message: 'Movie found successfully',
      data: movie,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.movieService.create(createMovieDto);
    return {
      message: 'Movie created successfully',
      data: movie,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const movie = await this.movieService.update(id, updateMovieDto);
    return {
      message: 'Movie updated successfully',
      data: movie,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
