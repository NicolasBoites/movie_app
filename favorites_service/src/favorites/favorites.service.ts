import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/favorite.schema';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async addToFavorites(userId: string, createFavoriteDto: CreateFavoriteDto): Promise<User> {
    const { movieId } = createFavoriteDto;
    
    // Find user by _id
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if movie is already in favorites
    if (user.favoriteMovieIds.includes(movieId)) {
      throw new ConflictException('Movie is already in favorites');
    }
    
    // Add movie to favorites using $push
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { favoriteMovieIds: movieId } },
      { new: true }
    ).exec();
    
    if (!updatedUser) {
      throw new BadRequestException('Error adding movie to favorites');
    }
    
    return updatedUser;
  }

  async getFavorites(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('favoriteMovieIds').exec();
    return user?.favoriteMovieIds || [];
  }

  async getUserWithFavorites(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async removeFromFavorites(userId: string, movieId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (!user.favoriteMovieIds.includes(movieId)) {
      throw new NotFoundException('Movie not found in favorites');
    }
    
    // Remove movie from favorites using $pull
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favoriteMovieIds: movieId } },
      { new: true }
    ).exec();
    
    if (!updatedUser) {
      throw new BadRequestException('Error removing movie from favorites');
    }
    
    return updatedUser;
  }

  async isFavorite(userId: string, movieId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).select('favoriteMovieIds').exec();
    return user?.favoriteMovieIds.includes(movieId) || false;
  }

  async getFavoritesCount(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).select('favoriteMovieIds').exec();
    return user?.favoriteMovieIds.length || 0;
  }

  async clearAllFavorites(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Clear all favorites using $set
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { favoriteMovieIds: [] } },
      { new: true }
    ).exec();
    
    if (!updatedUser) {
      throw new BadRequestException('Error clearing favorites');
    }
    
    return updatedUser;
  }
} 