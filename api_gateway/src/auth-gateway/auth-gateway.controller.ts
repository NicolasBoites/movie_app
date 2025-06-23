import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req, BadRequestException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiHeader
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'newuser123' },
        email: { type: 'string', format: 'email', example: 'newuser@example.com' },
        password: { type: 'string', example: 'SecurePassword123!' },
      },
      required: ['username', 'email', 'password'],
    },
    description: 'User registration data. Validation handled by Auth/User Microservice.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully. Returns access and refresh tokens.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or user already exists. Validation errors from Auth/User Microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Email already in use', 'Password must be strong'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async signup(@Body() dto: any) {
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
  @ApiOperation({ summary: 'Authenticate user and get tokens' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'email@example.com' },
        password: { type: 'string', example: 'CorrectPassword123!' },
      },
      required: ['username', 'password'],
    },
    description: 'User login credentials. Validation handled by Auth/User Microservice.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User authenticated successfully. Returns access and refresh tokens.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or incorrect credentials. Validation errors from Auth/User Microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['Invalid credentials', 'Username not found'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Incorrect username or password.' })
  async signin(@Body() dto: any) {
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Invalidate user sessions/tokens (logout)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged out.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User information not found in token for logout.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'User information not found in token for logout.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access (invalid or expired token).' })
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
  @ApiOperation({ summary: 'Refresh access and refresh tokens using a valid refresh token' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Refresh token (Bearer YOUR_REFRESH_TOKEN)',
    required: true,
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Refresh token missing or malformed.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Refresh token must be provided in Authorization header as Bearer token.' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid or expired refresh token.' })
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