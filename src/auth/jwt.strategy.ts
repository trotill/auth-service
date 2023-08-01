import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/const';
import jwtKeys from '../utils/keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtKeys.keys.publicKey,
    });
  }

  async validate({ role, login, aud, exp, iss }) {
    return {
      role,
      login,
      audience: aud,
      expired: exp,
      issuer: iss,
    };
  }
}
