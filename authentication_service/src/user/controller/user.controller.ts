import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { UpdateUserDto } from '../../common/_dtos/update_user.dto';
import { UserService } from '../service/user.service';
import { UserResponseDto } from '../../common/_dtos/user-response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AllExceptionsFilter } from 'src/common/filters/rpc-exception.filter';
import { ValidationInterceptor } from 'src/common/interceptors/validation.interceptor';
import { plainToClass } from 'class-transformer';

@UseFilters(AllExceptionsFilter)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  @UseInterceptors(new ValidationInterceptor(CreateUserDto, 'createUserDto'))
  async create(@Payload() payload: { createUserDto: any, userId?: string }): Promise<UserResponseDto> {
    const createUserDto = plainToClass(CreateUserDto, payload.createUserDto);
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll(@Payload() payload: { userId?: string }): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  // No necesita interceptor de validación de DTO.
  async findById(@Payload() payload: { id: string, userId?: string }): Promise<UserResponseDto> {
    return this.userService.findById(payload.id);
  }

  @MessagePattern({ cmd: 'update_user' })
  @UseInterceptors(new ValidationInterceptor(UpdateUserDto, 'updateUserDto'))
  async update(@Payload() payload: { id: string, updateUserDto: any, userId?: string }): Promise<boolean> {
    const updateUserDto = plainToClass(UpdateUserDto, payload.updateUserDto);
    return this.userService.update(payload.id, updateUserDto);
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
}