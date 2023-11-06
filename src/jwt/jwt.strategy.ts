import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ACCESS_TOKEN_COOKIE_NAME } from 'src/utils/const';
import jwtKeys from 'src/utils/keys';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/db/models/users.model';
import { ErrorMessage } from 'src/utils/error';
import type { JwtValidate } from './jwt.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
  ) {
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

  async validate({ role, login, aud, exp, iss }): Promise<JwtValidate> {
    const { locked } =
      (await this.userRepository.findOne({
        where: { login },
        raw: true,
      })) ?? {};
    if (locked)
      throw new HttpException(ErrorMessage.UserLocked, HttpStatus.FORBIDDEN);
    return {
      role,
      login,
      audience: aud,
      expired: exp,
      issuer: iss,
    };
  }
}
