import { Controller, UseFilters, UseInterceptors } from '@nestjs/common'; // Agrega UseInterceptors
import { AuthDto } from '../../common/_dtos/auth.dto';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { AuthService } from '../service/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AllExceptionsFilter } from '../../common/filters/rpc-exception.filter';
import { ValidationInterceptor } from '../../common/interceptors/validation.interceptor'; // ¡Importa el interceptor!
import { plainToClass } from 'class-transformer'; // ¡Importa plainToClass!

@UseFilters(AllExceptionsFilter)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_signup' })
  @UseInterceptors(new ValidationInterceptor(CreateUserDto)) // Aplica el interceptor
  async signup(@Payload() payload: any) { // Cambia el tipo a 'any' para el payload crudo
    // El interceptor ya validó el payload. Ahora lo transformamos a la instancia del DTO.
    const createUserDto = plainToClass(CreateUserDto, payload);
    return this.authService.signUp(createUserDto);
  }

  @MessagePattern({ cmd: 'auth_signin' })
  @UseInterceptors(new ValidationInterceptor(AuthDto)) // Aplica el interceptor
  async signin(@Payload() payload: any) { // Cambia el tipo a 'any' para el payload crudo
    // El interceptor ya validó el payload. Ahora lo transformamos a la instancia del DTO.
    const data = plainToClass(AuthDto, payload);
    return this.authService.signIn(data);
  }

  @MessagePattern({ cmd: 'auth_logout' })
  // Este endpoint no recibe un DTO complejo para validar, solo un 'userId' string.
  // Por lo tanto, no necesita el ValidationInterceptor.
  async logout(@Payload('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @MessagePattern({ cmd: 'auth_refresh_tokens' })
  // Si el payload es { refreshToken: string }, no es un DTO complejo que necesite
  // validación de campos extra/faltantes en el mismo nivel que otros DTOs.
  // El interceptor podría usarse si crearas un DTO específico para ese payload.
  // Por simplicidad, lo dejamos sin interceptor si ya estás seguro de la estructura.
  async refreshTokens(@Payload() payload: { refreshToken: string }) {
    return this.authService.refreshTokens(payload);
  }
}