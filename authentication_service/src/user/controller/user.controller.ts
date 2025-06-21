<<<<<<< Updated upstream
import { Controller, ValidationPipe } from '@nestjs/common';
=======
import { Controller, NotFoundException, UseFilters, UseInterceptors } from '@nestjs/common';
>>>>>>> Stashed changes
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { UpdateUserDto } from '../../common/_dtos/update_user.dto';
import { UserService } from '../service/user.service';
import { UserResponseDto } from '../../common/_dtos/user-response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload(ValidationPipe) payload: { createUserDto: CreateUserDto, userId?: string }): Promise<UserResponseDto> {
    return this.userService.create(payload.createUserDto);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll(@Payload() payload: { userId?: string }): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  async findById(@Payload() payload: { id: string, userId?: string }): Promise<UserResponseDto> {
    return this.userService.findById(payload.id);
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(@Payload() payload: { id: string, updateUserDto: UpdateUserDto, userId?: string }): Promise<boolean> {
    return this.userService.update(payload.id, payload.updateUserDto);
  }

  @MessagePattern({ cmd: 'remove_user' })
  async remove(@Payload() payload: { id: string, userId?: string }): Promise<UserResponseDto> {
    return this.userService.remove(payload.id);
  }

  @MessagePattern({ cmd: 'add_favorite_movie' })
  async addFavoriteMovie(@Payload() payload: { userId: string, movieId: string, actingUserId?: string }): Promise<boolean> {
    return this.userService.addFavoriteMovie(payload.userId, payload.movieId);
  }

  @MessagePattern({ cmd: 'remove_favorite_movie' })
  async removeFavoriteMovie(@Payload() payload: { userId: string, movieId: string, actingUserId?: string }): Promise<boolean> {
    return this.userService.removeFavoriteMovie(payload.userId, payload.movieId);
  }

  @MessagePattern({ cmd: 'get_favorite_movies' })
  async getFavoriteMovies(@Payload() payload: { userId: string }): Promise<string[]> {
    const user = await this.userService.findByIdInternal(payload.userId);
    if (!user) {
      throw new NotFoundException(`User ${payload.userId} not found`);
    }
    return user.favoriteMovieIds || [];
  }

}