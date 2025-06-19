import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { APIGatewayProxyHandler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { AppModule } from './app.module';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors({
      origin: true,
      credentials: true,
    });

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    nestApp.setGlobalPrefix('api/v1');

    await nestApp.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const server = await bootstrap();
  return server(event, context);
}; 