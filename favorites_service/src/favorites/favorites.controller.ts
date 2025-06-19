import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Add a movie to favorites' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 201,
    description: 'Movie added to favorites successfully',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Movie is already in favorites' })
  async addToFavorites(
    @Param('userId') userId: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    return this.favoritesService.addToFavorites(userId, createFavoriteDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User favorites document with movie IDs',
    type: FavoriteResponseDto,
  })
  async getFavorites(@Param('userId') userId: string): Promise<FavoriteResponseDto | null> {
    return this.favoritesService.getUserWithFavorites(userId);
  }

  @Get(':userId/list')
  @ApiOperation({ summary: 'Get list of favorite movie IDs' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Array of favorite movie IDs',
    schema: { 
      type: 'object', 
      properties: { 
        favoriteMovieIds: { 
          type: 'array', 
          items: { type: 'string' } 
        } 
      } 
    },
  })
  async getFavoritesList(@Param('userId') userId: string): Promise<{ favoriteMovieIds: string[] }> {
    const favoriteMovieIds = await this.favoritesService.getFavorites(userId);
    return { favoriteMovieIds };
  }

  @Get(':userId/count')
  @ApiOperation({ summary: 'Get total count of user favorites' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Total count of favorites',
    schema: { type: 'object', properties: { count: { type: 'number' } } },
  })
  async getCount(@Param('userId') userId: string): Promise<{ count: number }> {
    const count = await this.favoritesService.getFavoritesCount(userId);
    return { count };
  }

  @Get(':userId/check/:movieId')
  @ApiOperation({ summary: 'Check if a movie is in favorites' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'movieId', description: 'Movie ID to check' })
  @ApiResponse({
    status: 200,
    description: 'Favorite status',
    schema: { type: 'object', properties: { isFavorite: { type: 'boolean' } } },
  })
  async checkFavorite(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.favoritesService.isFavorite(userId, movieId);
    return { isFavorite };
  }

  @Delete(':userId/movie/:movieId')
  @ApiOperation({ summary: 'Remove a movie from favorites' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'movieId', description: 'Movie ID to remove' })
  @ApiResponse({ 
    status: 200, 
    description: 'Movie removed from favorites successfully',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found in favorites' })
  async removeFromFavorites(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<FavoriteResponseDto> {
    return this.favoritesService.removeFromFavorites(userId, movieId);
  }

  @Delete(':userId/clear')
  @ApiOperation({ summary: 'Clear all favorites' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'All favorites cleared successfully',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User favorites not found' })
  async clearAllFavorites(@Param('userId') userId: string): Promise<FavoriteResponseDto> {
    return this.favoritesService.clearAllFavorites(userId);
  }
} 