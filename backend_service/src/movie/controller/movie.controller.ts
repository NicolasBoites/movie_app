// movies-backend/src/movie/controller/movie.controller.ts

import { Controller, UseFilters, UseInterceptors } from '@nestjs/common'; // Asegúrate de importar UseInterceptors
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from '../service/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { AllExceptionsFilter } from 'src/common/filters/rpc-exception.filter'; // Importa tu filtro
import { ValidationInterceptor } from 'src/common/interceptors/validation.interceptor'; // ¡Importa el interceptor!
import { plainToClass } from 'class-transformer'; // ¡Importa plainToClass!

@UseFilters(AllExceptionsFilter) // Aplica tu filtro de excepciones RPC a todo el controlador
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
  @UseInterceptors(new ValidationInterceptor(CreateMovieDto)) // Aplica el interceptor para CreateMovieDto
  async create(@Payload() payload: any) { // Cambia el tipo del payload a 'any'
    // El interceptor ya validó el payload. Ahora lo transformamos a la instancia del DTO.
    const createDto = plainToClass(CreateMovieDto, payload);
    const movie = await this.movieService.create(createDto);
    return { message: 'Movie created successfully', data: movie };
  }

  @MessagePattern({ cmd: 'update_movie' })
  // Aplica el interceptor para UpdateMovieDto, especificando que está anidado bajo 'updateDto'
  @UseInterceptors(new ValidationInterceptor(UpdateMovieDto, 'updateDto'))
  async update(@Payload() payload: { id: string; updateDto: any }) { // Cambia el tipo de updateDto a 'any'
    const { id } = payload;
    // El interceptor ya validó payload.updateDto. Ahora lo transformamos a la instancia.
    const updateDto = plainToClass(UpdateMovieDto, payload.updateDto);
    const movie = await this.movieService.update(id, updateDto);
    return { message: 'Movie updated successfully', data: movie };
  }

  @MessagePattern({ cmd: 'delete_movie' })
  async remove(@Payload() id: string) {
    const result = await this.movieService.remove(id);
    return result;
  }
}