import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req, BadRequestException } from '@nestjs/common';
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
    if (!req.user || !req.user.sub) {
      throw new BadRequestException('User information not found in token for logout.');
    }

    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'auth_logout' },
      { userId: req.user.sub },
      null,
      'AUTH_USER_SERVICE',
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Refresh token must be provided in Authorization header as Bearer token.');
    }

    const refreshToken = authHeader.split(' ')[1];

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing from Authorization header.');
    }
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'auth_refresh_tokens' },
      { refreshToken },
      null,
      'AUTH_USER_SERVICE',
    );
  }
}