import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../common/gaurds/gaurd.access_token';
import { CreateUserDto } from '../_dtos/create_user.dto';
import { UpdateUserDto } from '../_dtos/update_user.dto';
import { User } from '../_schemas/user.schema';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../_dtos/user-response.dto';
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Patch(':id/favorites/:movieId')
  async addFavorite(@Param('id') id: string, @Param('movieId') movieId: string){
    return await this.userService.addFavoriteMovie(id, movieId);
  }

  @Delete(':id/favorites/:movieId')
  async removeFavorite(@Param('id') id: string, @Param('movieId') movieId: string) {
    return await this.userService.removeFavoriteMovie(id, movieId);
  }

  @Get(':id/favorites')
  async getFavoriteMovieIds(@Param('id') id: string) {
    return await this.userService.findById(id).then(user => user.favoriteMovieIds);
  }
}
