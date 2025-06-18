import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

// DTO interfaces
type AuthDto = { email: string; password: string };
type CreateUserDto = { username: string; email: string; password: string };

describe('AuthService', () => {
  let service: AuthService;
  let userService: {
    findByEmailInternal: jest.Mock;
    createInternal: jest.Mock;
    update: jest.Mock;
    findByIdInternal: jest.Mock;
  };
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let configService: Partial<Record<keyof ConfigService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findByEmailInternal: jest.fn(),
      createInternal: jest.fn(),
      update: jest.fn(),
      findByIdInternal: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    configService = {
      get: jest.fn().mockReturnValue('secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should throw BadRequestException if user already exists', async () => {
      userService.findByEmailInternal.mockResolvedValue({ email: 'a@b.com' });

      await expect(
        service.signUp({ username: 'test', email: 'a@b.com', password: 'pass' } as CreateUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signIn', () => {
    it('should throw BadRequestException if password is incorrect', async () => {
      const mockUser = { _id: { toString: () => '1' }, email: 'u@u.com', username: 'user', password: 'hashed' };
      userService.findByEmailInternal.mockResolvedValue(mockUser as any);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(
        service.signIn({ email: 'u@u.com', password: 'wrong' } as AuthDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
