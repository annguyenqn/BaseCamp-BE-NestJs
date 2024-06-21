import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private reflector: Reflector,
    private accountService: AccountsService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.accountService.findAccountById(payload['Id']);
    delete user['password'];
    return user;
  }
}
