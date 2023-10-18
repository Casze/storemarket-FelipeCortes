import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    try {
      if (!payload || !payload.sub || !payload.username) {
        throw new Error(
          'Token JWT inválido. Información faltante en el payload.',
        );
      }

      return { id: payload.sub, name: payload.username };
    } catch (error) {
      throw new UnauthorizedException('No autorizado', error.message);
    }
  }
}
