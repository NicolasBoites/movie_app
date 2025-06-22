import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth-gateway.controller';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthGatewayController],
  providers: [
    AccessTokenGuard,
    JwtStrategy,
  ],
  exports: [
    AccessTokenGuard,
  ],
})
export class AuthGatewayModule {}
