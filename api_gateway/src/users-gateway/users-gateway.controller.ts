import { Controller, Get, Post, Patch, Delete, Body, Param, Req, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ObjectIdValidationPipe } from '../common/pipes/object-id-validation.pipe';
import { SQS } from 'aws-sdk';

@ApiTags('Users Gateway')
@Controller('users')
export class UsersGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
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
  @UseGuards(AccessTokenGuard)
async addFavoriteMovie(
  @Param('id', ObjectIdValidationPipe) id: string,
  @Param('movieId') movieId: string,
  @Req() req: any,
) {
  const sqs = new SQS({ 
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }, });

  await sqs.sendMessage({
    QueueUrl: process.env.FAVORITES_QUEUE_URL!,
    MessageBody: JSON.stringify({
      cmd: 'add_favorite_movie',
      data: {
        userId: id,
        movieId,
        //actingUserId: req.user.sub,
      },
      //token: req.user, // opcional
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

  @Delete(':id/favorites/:movieId')
  @UseGuards(AccessTokenGuard)
async removeFavoriteMovie(
  @Param('id', ObjectIdValidationPipe) id: string,
  @Param('movieId') movieId: string,
  @Req() req: any,
) {
  const sqs = new SQS({ 
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
   });

  await sqs.sendMessage({
    QueueUrl: process.env.FAVORITES_QUEUE_URL!,
    MessageBody: JSON.stringify({
      cmd: 'remove_favorite_movie',
      data: {
        userId: id,
        movieId,
        //actingUserId: req.user.sub,
      },
      //token: req.user, // opcional
    }),
  }).promise();

  return { message: 'Movie deleted from favorites.' };
}

  @Get(':id/favorites')
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