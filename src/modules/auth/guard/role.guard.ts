import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/common/enum/Roles.enum';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.users) {
      return false;
    }
    return (
      user?.users?.some((acc) =>
        requiredRoles.some((role) => acc.roles.includes(role)),
      ) ?? false
    );
  }
}
