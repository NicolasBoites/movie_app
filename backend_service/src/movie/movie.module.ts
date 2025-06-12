import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schema/movie.schema';
import { MovieService } from './service/movie.service';
import { MovieController } from './controller/movie.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
