// api_gateway/src/auth/strategy/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');

    if (!secret) {
      throw new UnauthorizedException('ACCESS_TOKEN_SECRET configuration error');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    })
  }

  async validate(payload: any) {
    return { sub: payload.sub, username: payload.username };
  }
}