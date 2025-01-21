import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Environment } from 'src/common/constants/environment';
import { Request } from 'express';
type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Environment.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  validate(_: Request, payload: JwtPayload) {
    return payload;
  }
}
