import { Injectable, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super();
  }
  private async extractAccessToken(request: any) {
    if (!request.headers.authorization) {
      return null;
    }
    const authHeader = request.headers.authorization;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }
    const accessToken = parts[1];
    const accessTokenExist = await this.cacheService.get(`${accessToken}`);
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.extractAccessToken(request);
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }
}
