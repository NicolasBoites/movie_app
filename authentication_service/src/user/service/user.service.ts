import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { UpdateUserDto } from '../../common/_dtos/update_user.dto';
import { User, UserDocument } from '../_schemas/user.schema';
import { UserResponseDto } from '../../common/_dtos/user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      favoriteMovieIds: user.favoriteMovieIds || [],
    };
  }

  // MODEL services
  async createInternal(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async findByEmailInternal(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return user;
  }

  async findByIdInternal(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).lean().exec();
    return user;
  }

  // DTO services (Methods returning DTOs for external use)
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.createInternal(createUserDto);
    return this.mapToUserResponseDto(newUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const res = await this.userModel.find().lean();
    return res.map(user => this.mapToUserResponseDto(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.findByIdInternal(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToUserResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.findByEmailInternal(email);
    return user ? this.mapToUserResponseDto(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    const result = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    }).lean().exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }

  async remove(id: string): Promise<UserResponseDto> {
    const deleted = await this.userModel.findByIdAndDelete(id).lean().exec();
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToUserResponseDto(deleted);
  }

  async addFavoriteMovie(userId: string, movieId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    if (!user.favoriteMovieIds.includes(movieId)) {
      user.favoriteMovieIds.push(movieId);
      await user.save();
    }
    return true;
  }

  async removeFavoriteMovie(userId: string, movieId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    const initialLength = user.favoriteMovieIds.length;
    user.favoriteMovieIds = user.favoriteMovieIds.filter(id => id !== movieId);
    if (user.favoriteMovieIds.length < initialLength) {
        await user.save();
    }
    return true;
  }
}