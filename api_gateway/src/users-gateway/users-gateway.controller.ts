import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ObjectIdValidationPipe } from '../common/pipes/object-id-validation.pipe';
import { SQS } from 'aws-sdk';

@ApiTags('Users Gateway')
@Controller('users')
export class UsersGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'jane.doe' },
        email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
        password: { type: 'string', example: 'MyStrongP@ss123' },
      },
      required: ['username', 'email', 'password'],
    },
    description: 'Data for creating a new user. Validation handled by Auth/User Microservice.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2d' },
        username: { type: 'string', example: 'jane.doe' },
        email: { type: 'string', example: 'jane.doe@example.com' },
        favoriteMovieIds: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or user already exists. Check message for details from Auth/User Microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Email is invalid', 'Username is required'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async createUser(@Body() body: any, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'create_user' },
      { createUserDto: body, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2d' },
          username: { type: 'string', example: 'jane.doe' },
          email: { type: 'string', example: 'jane.doe@example.com' },
          favoriteMovieIds: { type: 'array', items: { type: 'string' }, example: ['60c72b2f9b1d8e001c8a1b2e'] },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async findAllUsers(@Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'find_all_users' },
      { userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to retrieve',
    example: '60c72b2f9b1d8e001c8a1b2d',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2d' },
        username: { type: 'string', example: 'jane.doe' },
        email: { type: 'string', example: 'jane.doe@example.com' },
        favoriteMovieIds: { type: 'array', items: { type: 'string' }, example: ['60c72b2f9b1d8e001c8a1b2e'] },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async findUserById(@Param('id', ObjectIdValidationPipe) id: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'find_user_by_id' },
      { id, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to update',
    example: '60c72b2f9b1d8e001c8a1b2d',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'new.jane.doe' },
        email: { type: 'string', format: 'email', example: 'new.email@example.com' },
        password: { type: 'string', example: 'NewStrongP@ss123' },
      },
    },
    description: 'Partial user data for update. Validation handled by Auth/User Microservice.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2d' },
        username: { type: 'string', example: 'new.jane.doe' },
        email: { type: 'string', example: 'new.email@example.com' },
        favoriteMovieIds: { type: 'array', items: { type: 'string' }, example: ['60c72b2f9b1d8e001c8a1b2e'] },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data. Check message for details from Auth/User Microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Email format is incorrect', 'Username cannot be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async updateUser(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'update_user' },
      { id, updateUserDto: body, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to delete',
    example: '60c72b2f9b1d8e001c8a1b2d',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async deleteUser(@Param('id', ObjectIdValidationPipe) id: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'remove_user' },
      { id, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Patch(':id/favorites/:movieId')
  @ApiOperation({ summary: 'Add a movie to user favorites (via SQS)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '60c72b2f9b1d8e001c8a1b2d' })
  @ApiParam({ name: 'movieId', type: String, description: 'Movie ID', example: '60c72b2f9b1d8e001c8a1b2e' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Request to add to favorites sent to SQS. Actual update happens asynchronously.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or movie not found.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async addFavoriteMovie(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('movieId') movieId: string,
    @Req() req: any,
  ) {
    const sqs = new SQS({
      region: 'us-east-1',
    });

    await sqs.sendMessage({
      QueueUrl: process.env.FAVORITES_QUEUE_URL!,
      MessageBody: JSON.stringify({
        cmd: 'add_favorite_movie',
        data: {
          userId: id,
          movieId,
        },
      }),
    }).promise();
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'add_favorite_movie' },
      { userId: id, movieId, actingUserId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Patch(':id/lambda/:movieId')
  @ApiOperation({ summary: 'Add a movie to user favorites (via Lambda)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '60c72b2f9b1d8e001c8a1b2d' })
  @ApiParam({ name: 'movieId', type: String, description: 'Movie ID', example: '60c72b2f9b1d8e001c8a1b2e' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Movie added to favorites via lambda.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or movie not found.' })
  async addFavoriteMovieByLambda(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('movieId') movieId: string
  ) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'add_favorite_movie' },
      { userId: id, movieId },
      null,
      'AUTH_USER_SERVICE',
    );
  }

  @Delete(':id/lambda/:movieId')
  @ApiOperation({ summary: 'Remove a movie from user favorites (via Lambda)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '60c72b2f9b1d8e001c8a1b2d' })
  @ApiParam({ name: 'movieId', type: String, description: 'Movie ID', example: '60c72b2f9b1d8e001c8a1b2e' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Movie removed from favorites via lambda.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or movie not found.' })
  async removeFavoriteMovieByLambda(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('movieId') movieId: string
  ) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'remove_favorite_movie' },
      { userId: id, movieId },
      null,
      'AUTH_USER_SERVICE',
    );
  }

  @Delete(':id/favorites/:movieId')
  @ApiOperation({ summary: 'Remove a movie from user favorites (via SQS)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '60c72b2f9b1d8e001c8a1b2d' })
  @ApiParam({ name: 'movieId', type: String, description: 'Movie ID', example: '60c72b2f9b1d8e001c8a1b2e' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Request to remove from favorites sent to SQS. Actual update happens asynchronously.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or movie not found.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async removeFavoriteMovie(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('movieId') movieId: string,
    @Req() req: any,
  ) {
    const sqs = new SQS({
      region: 'us-east-1',
    });

    await sqs.sendMessage({
      QueueUrl: process.env.FAVORITES_QUEUE_URL!,
      MessageBody: JSON.stringify({
        cmd: 'remove_favorite_movie',
        data: {
          userId: id,
          movieId,
        },
      }),
    }).promise();

    return { message: 'Movie deleted from favorites.' };
  }

  @Get(':id/favorites')
  @ApiOperation({ summary: 'Retrieve favorite movies for a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '60c72b2f9b1d8e001c8a1b2d' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of favorite movies retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60c72b2f9b1d8e001c8a1b2e' },
          title: { type: 'string', example: 'The Social Network' },
          rank: { type: 'number', example: 8 },
          genre: { type: 'string', example: 'Drama' },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async getFavoriteMovies(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: any,
    @Query() query: any
  ) {
    const users: any = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'find_user_by_id' },
      { id },
      null,
      'AUTH_USER_SERVICE',
    );
    const moviesIds = users.favoriteMovieIds;
    if (!moviesIds || moviesIds.length === 0) {
      return [];
    }

    const movies: any = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movies_by_ids' },
      { moviesIds, query },
      null,
      'MOVIES_SERVICE',
    );

    return movies;
  }
}