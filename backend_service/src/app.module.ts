import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/MoviesApp'),
    MovieModule,
  ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {}
