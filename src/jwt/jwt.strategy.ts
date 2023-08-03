import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ACCESS_TOKEN_COOKIE_NAME } from 'src/utils/const';
import jwtKeys from 'src/utils/keys';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/db/models/users.model';
import { SessionsModel } from 'src/db/models/sessions.model';
import { errorMessage } from 'src/utils/error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
    @InjectModel(SessionsModel) private sessionRepository: typeof SessionsModel,
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

  async validate({ role, login, aud, exp, iss }) {
    const { locked } =
      (await this.userRepository.findOne({
        where: { login },
        raw: true,
      })) ?? {};
    if (locked)
      throw new HttpException(errorMessage.UserLocked, HttpStatus.FORBIDDEN);
    return {
      role,
      login,
      audience: aud,
      expired: exp,
      issuer: iss,
    };
  }
}
