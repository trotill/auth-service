import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGlobalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const role = context.switchToHttp().getRequest().role;
    if (!roles) {
      return true;
    }
    const { access: accessToken } = context.switchToHttp().getRequest().cookies;

    return false;
  }
}
