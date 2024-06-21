import {
  Injectable,
  Inject,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AccountsService } from 'src/modules/accounts/accounts.service';
@Injectable()
export class multiTenant implements NestMiddleware {
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
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(`SECRET`),
      });
      const acc = await this.accountService.findAccountById(decodedToken.Id);
      req.headers['CompanyId'] = acc.companyId.toString();
      next();
    } else {
      throw new UnauthorizedException('Authorization token is missing');
    }
  }
}
