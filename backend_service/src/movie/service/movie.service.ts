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

  async findAll(page = 1, limit = 10): Promise<any[]> {
    const skip = (page - 1) * limit;
    const docs = await this.movieModel
      .find()
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    //Mapeo `id` en vez de `_id`
    return docs.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      rank: doc.rank,
      genre: doc.genre,
    }));
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
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
}
