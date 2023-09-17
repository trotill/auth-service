import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN_COOKIE_NAME } from 'src/utils/const';
import jwtKeys from 'src/utils/keys';
import { verifyToken } from 'src/auth/auth.utils';

@Injectable()
export class JwtGlobalGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async canActivate(context: ExecutionContext) {
    const { url, cookies } = context.getArgs()[0];
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
    }
    return super.canActivate(context);
  }
}
