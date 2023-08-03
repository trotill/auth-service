import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/const';
import jwtKeys from '../utils/keys';
import { verifyToken } from '../auth/auth.utils';

@Injectable()
export class JwtGlobalGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async canActivate(context: ExecutionContext) {
    if ('args' in context) {
      if (context.args[0].url === '/auth/login') return true;
      if (context.args[0].url === '/auth/refresh') {
        const access = context.args[0].cookies[ACCESS_TOKEN_COOKIE_NAME];
        return !!(await verifyToken(access, jwtKeys.keys.publicKey).catch(
          (err) => {
            return err.name === 'TokenExpiredError';
          },
        ));
      }
    }
    return super.canActivate(context);
  }
}
