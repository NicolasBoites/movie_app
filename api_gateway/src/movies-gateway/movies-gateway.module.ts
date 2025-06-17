import { Module } from '@nestjs/common';
import { MoviesGatewayController } from './movies-gateway.controller';
import { AuthGatewayModule } from '../auth-gateway/auth-gateway.module';

@Module({
  imports: [
    AuthGatewayModule,
  ],
  controllers: [MoviesGatewayController],
})
export class MoviesGatewayModule {}