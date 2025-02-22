import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  HEADER_X_ROLE,
  HEADER_X_USER,
  HEADER_X_USERS_UPDATE,
} from 'src/utils/const';
import jwtKeys from 'src/utils/keys';
import { verifyToken } from 'src/auth/auth.utils';

@Injectable()
export class JwtGlobalGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async canActivate(context: ExecutionContext) {
    const { url, cookies, route, headers } = context.getArgs()[0];
    if ('args' in context) {
      switch (url) {
        case '/auth/login':
        case '/users/register':
          return true;
        case '/auth/refresh': {
          const access = cookies[ACCESS_TOKEN_COOKIE_NAME];
          return !!(await verifyToken(access, jwtKeys.keys.publicKey).catch(
            (err) => {
              return err.name === 'TokenExpiredError';
            },
          ));
        }
      }
      if (
        +HEADER_X_USERS_UPDATE &&
        route.path.startsWith('/users') &&
        headers[HEADER_X_USER] &&
        headers[HEADER_X_ROLE]
      ) {
        context.getArgs()[0]['user'] = {
          login: headers[HEADER_X_USER],
          role: headers[HEADER_X_ROLE],
        };
        return true;
      }
    }

    return super.canActivate(context);
  }
}
