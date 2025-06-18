// auth-user-microservice/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {
    //logger: ['log', 'error', 'warn'], // Muestra solo logs, errores y advertencias
    logger: ['log', 'error', 'warn', 'debug'],
  });
  const configService = app.get(ConfigService);

  const tcpPort = configService.get<number>('PORT');
  const httpPort = configService.get<number>('HTTP_PORT', 3009);
  const tcpHost = configService.get<string>('HOST', '0.0.0.0');

  if (!tcpPort) {
    throw new Error('PORT environment variable not set or not loaded for TCP microservice.');
  }

  const config = new DocumentBuilder()
    .setTitle('Auth/User Microservice API')
    .setDescription('The API description for the Auth/User microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: tcpHost,
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(`Auth/User Microservice TCP escuchando en el puerto ${tcpPort}`);
  console.log(`Auth/User Microservice HTTP (Swagger) escuchando en el puerto ${httpPort}`);
}
bootstrap();