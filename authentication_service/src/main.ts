// auth-user-microservice/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const tcpPort = configService.get<number>('PORT', 3001);
  const httpPort = configService.get<number>('HTTP_PORT', 3009);
  const tcpHost = configService.get<string>('HOST', 'localhost');

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

  app.useGlobalFilters(new AllExceptionsFilter());

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
