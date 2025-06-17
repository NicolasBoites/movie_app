import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './_dtos/auth.dto';
import { CreateUserDto } from './_dtos/create_user.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { Public } from '../decorators/public.decorator';

@ApiTags('Auth Gateway')
@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'auth_signup' },
      dto,
      null,
      'AUTH_USER_SERVICE',
    );
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'auth_signin' },
      dto,
      null,
      'AUTH_USER_SERVICE',
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'auth_logout' },
      {},
      req.user,
      'AUTH_USER_SERVICE',
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body('refreshToken') refreshToken: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'auth_refresh_tokens' },
      { refreshToken },
      req.user,
      'AUTH_USER_SERVICE',
    );
  }
}