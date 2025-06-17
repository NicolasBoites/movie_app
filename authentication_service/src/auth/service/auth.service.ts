import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../../user/service/user.service';
import { AuthDto } from '../../common/_dtos/auth.dto';
import { CreateUserDto } from '../../common/_dtos/create_user.dto';
import { LoginResponse } from '../_types/res.login.interface';
import { Tokens } from '../_types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<LoginResponse> {
    const userExists = await this.userService.findByEmailInternal(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.userService.createInternal({
      ...createUserDto,
      password: hash,
    });

    const tokens = await this.getTokens(newUser._id.toString(), newUser.email);
    await this.updateRefreshToken(newUser._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      name: newUser.username,
      email: newUser.email,
      id: newUser._id.toString(),
    };
  }

  async signIn(data: AuthDto): Promise<LoginResponse> {
    const user = await this.userService.findByEmailInternal(data.email);
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      name: user.username,
      email: user.email,
      id: user._id.toString(),
    };
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: undefined });
  }

  async hashData(data: string) {
    return await argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<LoginResponse> {
    const user = await this.userService.findByIdInternal(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      name: user.username,
      email: user.email,
      id: user._id.toString(),
    };
  }
}
