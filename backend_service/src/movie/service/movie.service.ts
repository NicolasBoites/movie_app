import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../schema/movie.schema';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async findAll(
  page = 1,
  limit = 10,
  title?: string,      
): Promise<any[]> {
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }

  const docs = await this.movieModel
    .find(filter)
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return docs.map(doc => ({
    id: doc._id.toString(),
    title: doc.title,
    rank: doc.rank,
    genre: doc.genre,
  }));
}

  async findOne(id: string): Promise<any> {
    const movie = await this.movieModel.findById(id).lean();
    if (!movie) throw new NotFoundException('Movie not found');
  
    return {
      id: movie._id.toString(),
      title: movie.title,
      rank: movie.rank,
      genre: movie.genre,
    };
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie = new this.movieModel(createMovieDto);
    return newMovie.save();
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const updated = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Movie not found');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.movieModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Movie not found');
    return { message: 'Movie deleted successfully' };
  }

  async findByIds (moviesIds: string [], page = 1, limit = 10, title?: string): Promise<any> {
    const filter: any = {};
    const skip = (page - 1) * limit;
    filter._id = { $in: moviesIds };

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    
    const docs = await this.movieModel
    .find(filter)
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
    
    return docs.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      rank: doc.rank,
      genre: doc.genre,
    }));
  }
}
