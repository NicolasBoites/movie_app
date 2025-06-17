import {
  Controller,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from '../../common/_dtos/auth.dto';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { AuthService } from '../service/auth.service';
import { LoginResponse } from '../_types/res.login.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_signup' })
  async signUp(@Payload(ValidationPipe) createUserDto: CreateUserDto): Promise<LoginResponse> {
    return this.authService.signUp(createUserDto);
  }

  @MessagePattern({ cmd: 'auth_signin' })
  async signIn(@Payload(ValidationPipe) data: AuthDto): Promise<LoginResponse> {
    return this.authService.signIn(data);
  }

  @MessagePattern({ cmd: 'auth_logout' })
  async logout(@Payload() payload: { userId: string }) {
    return this.authService.logout(payload.userId);
  }

  @MessagePattern({ cmd: 'auth_refresh_tokens' })
  async refreshTokens(@Payload() payload: { refreshToken: string }) {
    return this.authService.refreshTokens(payload);
  }
}
