import {
  Injectable,
  Inject,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class accessToken implements NestMiddleware {
  constructor(
    private readonly accountService: AccountsService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const refreshTokenExist = await this.cacheService.get(`${token}`);
      if (refreshTokenExist) {
        throw new ForbiddenException('Invalid Token');
      }
      next();
    } else {
      throw new UnauthorizedException('Authorization token is missing');
    }
  }
}
