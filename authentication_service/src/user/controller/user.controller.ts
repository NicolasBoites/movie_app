import { Controller, UseFilters, UseInterceptors } from '@nestjs/common'; // Agrega UseInterceptors
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { UpdateUserDto } from '../../common/_dtos/update_user.dto';
import { UserService } from '../service/user.service';
import { UserResponseDto } from '../../common/_dtos/user-response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AllExceptionsFilter } from 'src/common/filters/rpc-exception.filter'; // Ajusta la ruta si es necesario
import { ValidationInterceptor } from 'src/common/interceptors/validation.interceptor'; // ¡Importa el interceptor!
import { plainToClass } from 'class-transformer'; // ¡Importa plainToClass!

@UseFilters(AllExceptionsFilter)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  // Usa el interceptor, indicando que CreateUserDto está anidado bajo la clave 'createUserDto' en el payload.
  @UseInterceptors(new ValidationInterceptor(CreateUserDto, 'createUserDto'))
  async create(@Payload() payload: { createUserDto: any, userId?: string }): Promise<UserResponseDto> {
    // El interceptor ya validó payload.createUserDto. Ahora lo transformamos a la instancia.
    const createUserDto = plainToClass(CreateUserDto, payload.createUserDto);
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  // No necesita interceptor de validación de DTO, ya que no recibe un DTO complejo para validar.
  async findAll(@Payload() payload: { userId?: string }): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  // No necesita interceptor de validación de DTO.
  async findById(@Payload() payload: { id: string, userId?: string }): Promise<UserResponseDto> {
    return this.userService.findById(payload.id);
  }

  @MessagePattern({ cmd: 'update_user' })
  // Usa el interceptor, indicando que UpdateUserDto está anidado bajo la clave 'updateUserDto'.
  @UseInterceptors(new ValidationInterceptor(UpdateUserDto, 'updateUserDto'))
  async update(@Payload() payload: { id: string, updateUserDto: any, userId?: string }): Promise<boolean> {
    // El interceptor ya validó payload.updateUserDto. Ahora lo transformamos a la instancia.
    const updateUserDto = plainToClass(UpdateUserDto, payload.updateUserDto);
    return this.userService.update(payload.id, updateUserDto);
  }

  @MessagePattern({ cmd: 'remove_user' })
  // No necesita interceptor de validación de DTO.
  async remove(@Payload() payload: { id: string, userId?: string }): Promise<UserResponseDto> {
    return this.userService.remove(payload.id);
  }

  @MessagePattern({ cmd: 'add_favorite_movie' })
  // No necesita interceptor de validación de DTO.
  async addFavoriteMovie(@Payload() payload: { userId: string, movieId: string, actingUserId?: string }): Promise<boolean> {
    return this.userService.addFavoriteMovie(payload.userId, payload.movieId);
  }

  @MessagePattern({ cmd: 'remove_favorite_movie' })
  // No necesita interceptor de validación de DTO.
  async removeFavoriteMovie(@Payload() payload: { userId: string, movieId: string, actingUserId?: string }): Promise<boolean> {
    return this.userService.removeFavoriteMovie(payload.userId, payload.movieId);
  }
}