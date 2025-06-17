import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AuthGatewayController } from '../auth-gateway/auth-gateway.controller';
import { UsersGatewayController } from '../users-gateway/users-gateway.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'AUTH_USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3000,
        }
      }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [ProxyService],
  controllers: [AuthGatewayController, UsersGatewayController],
  exports: [JwtModule],
})
export class UsersModule {}
