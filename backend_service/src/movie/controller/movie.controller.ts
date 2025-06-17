import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from '../service/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern({ cmd: 'get_movies' })
  async findAll(@Payload() payload: { page: number; limit: number; title?: string }) {
    const { page, limit, title } = payload;
    return {
      message: 'Movies found successfully',
      data: await this.movieService.findAll(page, limit, title),
    };
  }

  @MessagePattern({ cmd: 'get_movie' })
  async findOne(@Payload() id: string) {
    const movie = await this.movieService.findOne(id);
    return { message: 'Movie found successfully', data: movie };
  }

  @MessagePattern({ cmd: 'create_movie' })
  async create(@Payload() createDto: CreateMovieDto) {
    const movie = await this.movieService.create(createDto);
    return { message: 'Movie created successfully', data: movie };
  }

  @MessagePattern({ cmd: 'update_movie' })
  async update(@Payload() payload: { id: string; updateDto: UpdateMovieDto }) {
    const { id, updateDto } = payload;
    const movie = await this.movieService.update(id, updateDto);
    return { message: 'Movie updated successfully', data: movie };
  }

  @MessagePattern({ cmd: 'delete_movie' })
  async remove(@Payload() id: string) {
    const result = await this.movieService.remove(id);
    return result;
  }
}
