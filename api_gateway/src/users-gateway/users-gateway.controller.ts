// api_gateway/src/users-gateway/users-gateway.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Req, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ObjectIdValidationPipe } from '../common/pipes/object-id-validation.pipe';

@ApiTags('Users Gateway')
@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  async createUser(@Body() body: any, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'create_user' },
      { createUserDto: body, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Get()
  async findAllUsers(@Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'find_all_users' },
      { userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Get(':id')
  async findUserById(@Param('id', ObjectIdValidationPipe) id: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'find_user_by_id' },
      { id, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Patch(':id')
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
  async deleteUser(@Param('id', ObjectIdValidationPipe) id: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'remove_user' },
      { id, userId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Patch(':id/favorites/:movieId')
  async addFavoriteMovie(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('movieId') movieId: string,
    @Req() req: any,
  ) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'add_favorite_movie' },
      { userId: id, movieId, actingUserId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Delete(':id/favorites/:movieId')
  async removeFavoriteMovie(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('movieId') movieId: string,
    @Req() req: any,
  ) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'remove_favorite_movie' },
      { userId: id, movieId, actingUserId: req.user.sub },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }
}