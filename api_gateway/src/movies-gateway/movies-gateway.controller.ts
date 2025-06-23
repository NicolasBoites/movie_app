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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
// No DTO imports here anymore:
// import { CreateMovieDto } from '../movies/_dtos/create-movie.dto';
// import { UpdateMovieDto } from '../movies/_dtos/update-movie.dto';

@ApiTags('Movies Gateway')
@ApiBearerAuth() // Indicates that all endpoints in this controller require JWT authentication
@Controller('movies')
@UseGuards(AccessTokenGuard)
export class MoviesGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all movies (with optional filters)' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter by movie title',
    example: 'Inception',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    description: 'Filter by movie genre',
    example: 'Sci-Fi',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of movies retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2c' },
          title: { type: 'string', example: 'Inception' },
          rank: { type: 'number', example: 9 },
          genre: { type: 'string', example: 'Sci-Fi' },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movies' },
      query,
      null,
      'MOVIES_SERVICE',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a movie by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the movie to retrieve',
    example: '60c72b2f9b1d8e001c8a1b2c',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2c' },
        title: { type: 'string', example: 'Inception' },
        rank: { type: 'number', example: 9 },
        genre: { type: 'string', example: 'Sci-Fi' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movie' },
      id,
      null,
      'MOVIES_SERVICE',
    );
    return movie;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Dune: Part Two' },
        rank: { type: 'number', example: 10, description: 'Must be a number' },
        genre: { type: 'string', example: 'Sci-Fi' },
      },
      required: ['title', 'rank', 'genre'],
    },
    description: 'Data for creating a new movie. Validation happens in the Movies Microservice.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movie created successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2f' },
        title: { type: 'string', example: 'Dune: Part Two' },
        rank: { type: 'number', example: 10 },
        genre: { type: 'string', example: 'Sci-Fi' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data. Check message for details from Movies Microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Title must not be empty', 'Rank must be a number'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'create_movie' },
      createDto,
      null,
      'MOVIES_SERVICE',
    );
    return movie;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing movie' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the movie to update',
    example: '60c72b2f9b1d8e001c8a1b2c',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Dune: Part Two (Extended Cut)' },
        rank: { type: 'number', example: 11, description: 'Must be a number' },
        genre: { type: 'string', example: 'Sci-Fi'},
      },
    },
    description: 'Data for updating the movie (partial updates allowed). Validation happens in the Movies Microservice.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie updated successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2c' },
        title: { type: 'string', example: 'Dune: Part Two (Extended Cut)' },
        rank: { type: 'number', example: 11 },
        genre: { type: 'string', example: 'Sci-Fi' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data. Check message for details from Movies Microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Invalid rank value', 'Genre must be a string'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'update_movie' },
      { id, updateDto },
      null,
      'MOVIES_SERVICE',
    );
    return movie;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the movie to delete',
    example: '60c72b2f9b1d8e001c8a1b2c',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Movie deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
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