import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger('MoviesMicroservice');

  const tempApp = await NestFactory.createApplicationContext(AppModule);
  const configService = tempApp.get(ConfigService);
  await tempApp.close();

  const tcpHost = configService.get<string>('TCP_HOST', '127.0.0.1');
  const tcpPort = configService.get<number>('TCP_PORT', 4000);

  if (!tcpPort) {
    throw new Error('TCP_PORT environment variable not set or not loaded for TCP microservice.');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: tcpHost,
      port: tcpPort,
    },
  });
  const enableWhitelist = configService.get<string>('VALIDATION_WHITELIST') === 'true';
  const enableForbidNonWhitelisted = configService.get<string>('FORBID_NON_WHITELISTED') === 'true';

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: enableWhitelist, 
    forbidNonWhitelisted: enableForbidNonWhitelisted 
  }));

  await app.listen();
  logger.log(`TCP microservice is listening on ${tcpHost}:${tcpPort}`);
}

bootstrap();