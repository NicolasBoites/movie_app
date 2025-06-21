<<<<<<< Updated upstream
import {
  Body,
  Controller,
  Logger,
  UseFilters,
} from '@nestjs/common';
=======
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
>>>>>>> Stashed changes
import { AuthDto } from '../../common/_dtos/auth.dto';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { AuthService } from '../service/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
<<<<<<< Updated upstream
import { AllExceptionsFilter } from 'src/common/filters/rpc-exception.filter';
=======
import { AllExceptionsFilter } from '../../common/filters/rpc-exception.filter';
import { ValidationInterceptor } from '../../common/interceptors/validation.interceptor';
import { plainToClass } from 'class-transformer';
>>>>>>> Stashed changes

@UseFilters(AllExceptionsFilter)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_signup' })
<<<<<<< Updated upstream
  async signup(@Payload() createUserDto: CreateUserDto) {
=======
  @UseInterceptors(new ValidationInterceptor(CreateUserDto))
  async signup(@Payload() payload: any) {
    const createUserDto = plainToClass(CreateUserDto, payload);
>>>>>>> Stashed changes
    return this.authService.signUp(createUserDto);
  }

  @MessagePattern({ cmd: 'auth_signin' })
<<<<<<< Updated upstream
  async signin(@Payload() data: AuthDto) {
=======
  @UseInterceptors(new ValidationInterceptor(AuthDto))
  async signin(@Payload() payload: any) {
    const data = plainToClass(AuthDto, payload);
>>>>>>> Stashed changes
    return this.authService.signIn(data);
  }

  @MessagePattern({ cmd: 'auth_logout' })
  async logout(@Payload('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @MessagePattern({ cmd: 'auth_refresh_tokens' })
  async refreshTokens(@Payload() payload: { refreshToken: string }) {
    return this.authService.refreshTokens(payload);
  }
}