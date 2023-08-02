import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import jwtKeys from '../utils/keys';
import { IGNORE_CHECK_TOKEN_ROUTE_LIST } from '../utils/const';

@Injectable()
export class JwtGlobalGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (
      'args' in context &&
      IGNORE_CHECK_TOKEN_ROUTE_LIST.includes(context.args[0].url)
    )
      return true;
    return super.canActivate(context);
  }
}
