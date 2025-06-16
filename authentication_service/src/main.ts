import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptor/interceptor.transform';

async function bootstrap() {
  if(!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
    })
  );
  app.useGlobalInterceptors(new TransformInterceptor());
    const config = new DocumentBuilder()
    .setTitle('Auth-Users')
    .setDescription('Auth-Users API')
    .setVersion('1.0')
    .addTag('auth-users')
    .addBearerAuth()
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
