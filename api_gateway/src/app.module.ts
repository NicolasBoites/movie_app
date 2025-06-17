// api_gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsConfigModule } from './common/clients/clients.module';

import { AuthGatewayModule } from './auth-gateway/auth-gateway.module';
import { MoviesGatewayModule } from './movies-gateway/movies-gateway.module';
import { UsersGatewayModule } from './users-gateway/users-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsConfigModule,
    AuthGatewayModule,
    UsersGatewayModule,
    MoviesGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}