import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CreateMovieDto } from '../../../backend_service/src/movie/dto/create-movie.dto';
import { UpdateMovieDto } from '../../../backend_service/src/movie/dto/update-movie.dto';
import { GetMoviesQueryDto } from './_dtos/getmovies-query.dto';

@ApiTags('Movies Gateway')
@Controller('movies')
@UseGuards(AccessTokenGuard)
export class MoviesGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query(ValidationPipe) query: GetMoviesQueryDto) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movies' },
      query,
      null,
      'MOVIES_SERVICE',
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movie' },
      id,
      null,
      'MOVIES_SERVICE',
    );
    return { message: 'Movie found successfully', data: movie };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createDto: CreateMovieDto) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'create_movie' },
      createDto,
      null,
      'MOVIES_SERVICE',
    );
    return { message: 'Movie created successfully', data: movie };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateMovieDto,
  ) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'update_movie' },
      { id, updateDto },
      null,
      'MOVIES_SERVICE',
    );
    return { message: 'Movie updated successfully', data: movie };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const result = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'delete_movie' },
      id,
      null,
      'MOVIES_SERVICE',
    );
    return result;
  }
}