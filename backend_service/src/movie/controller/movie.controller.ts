import { Controller, NotFoundException, UseFilters, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from '../service/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { AllExceptionsFilter } from 'src/common/filters/rpc-exception.filter';
import { ValidationInterceptor } from 'src/common/interceptors/validation.interceptor';
import { plainToClass } from 'class-transformer';

@UseFilters(AllExceptionsFilter)
@Controller()
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
  @UseInterceptors(new ValidationInterceptor(CreateMovieDto))
  async create(@Payload() payload: any) {
    const createDto = plainToClass(CreateMovieDto, payload);
    const movie = await this.movieService.create(createDto);
    return { message: 'Movie created successfully', data: movie };
  }

  @MessagePattern({ cmd: 'update_movie' })
  @UseInterceptors(new ValidationInterceptor(UpdateMovieDto, 'updateDto'))
  async update(@Payload() payload: { id: string; updateDto: any }) {
    const { id } = payload;
    const updateDto = plainToClass(UpdateMovieDto, payload.updateDto);
    const movie = await this.movieService.update(id, updateDto);
    return { message: 'Movie updated successfully', data: movie };
  }

  @MessagePattern({ cmd: 'delete_movie' })
  async remove(@Payload() id: string) {
    const result = await this.movieService.remove(id);
    return result;
  }

  @MessagePattern({ cmd: 'get_movies_by_ids' })
  async getFavoriteMovies(@Payload() payload: { moviesIds: string [], page: number; limit: number; title?: string} ): Promise<string[]> {
    const { page, limit, title, moviesIds } = payload;
    return await this.movieService.findByIds(moviesIds, page, limit, title);
  }
}