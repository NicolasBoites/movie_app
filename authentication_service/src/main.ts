import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptor/interceptor.transform';

async function bootstrap() {
  if(!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URIin environment variables');
  }
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
    })
  );
    const config = new DocumentBuilder()
    .setTitle('Auth')
    .setDescription('Auth API')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
