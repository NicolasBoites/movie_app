import { Module } from '@nestjs/common';
import { UsersGatewayController } from './users-gateway.controller';
import { AuthGatewayModule } from '../auth-gateway/auth-gateway.module';

@Module({
  imports: [
    AuthGatewayModule,
  ],
  controllers: [UsersGatewayController],
})
export class UsersGatewayModule {}
