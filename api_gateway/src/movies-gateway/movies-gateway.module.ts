import { Module } from '@nestjs/common';
import { MoviesGatewayController } from './movies-gateway.controller';
import { ClientsConfigModule } from '../common/clients/clients.module';
@Module({
  imports: [ClientsConfigModule],
  controllers: [MoviesGatewayController],
})
export class MoviesGatewayModule {}