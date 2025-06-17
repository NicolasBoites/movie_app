import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy/proxy.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_USER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_USER_MS_HOST', 'localhost'),
            port: configService.get<number>('AUTH_USER_MS_PORT', 3001),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'MOVIES_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('MOVIES_MS_HOST', 'localhost'),
            port: configService.get<number>('MOVIES_MS_PORT', 3000),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProxyService],
  exports: [ClientsModule, ProxyService],
})
export class ClientsConfigModule {}