import {
  Body,
  Controller,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { AuthDto } from '../../common/_dtos/auth.dto';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { AuthService } from '../service/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AllExceptionsFilter } from 'src/common/filters/rpc-exception.filter';

@UseFilters(AllExceptionsFilter)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_signup' })
  async signup(@Payload() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @MessagePattern({ cmd: 'auth_signin' })
  async signin(@Payload() data: AuthDto) {
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