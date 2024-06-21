import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  UseFilters,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '../accounts/accounts.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
  async signIn(SignInDto: SignInDto) {
    const acc = await this.accountService.findAccountByEmail(SignInDto.email);
    if (!acc) {
      throw new NotFoundException('Email not exist');
    }
    const isPasswordMatch = await bcrypt.compare(
      SignInDto.password,
      acc.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException(jwtConstants.wrongpass);
    }
    let roles = [];
    const users = await this.userService.findUserByAccountID(acc.id);
    users.forEach((user) => {
      let userRoles = user.roles.split(',');
      userRoles.forEach((role) => {
        if (!roles.includes(role.trim())) {
          roles.push(role.trim());
        }
      });
    });
    const token = await this.generateToken(acc.id, acc.email, roles);
    return token;
  }
  async generateToken(
    Id: number,
    email: string,
    roles: string[],
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        await this.jwtService.signAsync(
          { Id: Id, email: email, roles: roles },
          {
            secret: this.configService.get<string>(`${jwtConstants.SECRET}`),
            expiresIn: '1d',
          },
        ),
        await this.jwtService.signAsync(
          { Id: Id, email: email, roles: roles },
          {
            secret: this.configService.get<string>(`${jwtConstants.SECRET}`),
            expiresIn: '7d',
          },
        ),
      ]);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      throw new e();
    }
  }
  async refreshTokens(accessToken: string, refreshToken: string) {
    const refreshTokenExist = await this.cacheService.get(`${refreshToken}`);
    if (refreshTokenExist) {
      throw new ForbiddenException('Invalid Token');
    }
    await this.cacheService.set(`${accessToken}`, `${accessToken}`);
    await this.cacheService.set(`${refreshToken}`, `${refreshToken}`);
    const { Id, email, roles } = await this.verifyToken(refreshToken);
    const tokens = await this.generateToken(Id, email, roles);
    return tokens;
  }

  async verifyToken(
    refreshToken: string,
  ): Promise<{ Id: number; email: string; roles: string[] }> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>(`${jwtConstants.SECRET}`),
      });
      return {
        Id: decodedToken.Id,
        email: decodedToken.email,
        roles: decodedToken.roles,
      };
    } catch (error) {
      throw new ForbiddenException('Invalid Refresh Token ');
    }
  }

  async selectUser(accessToken: string, userId: number) {
    const { Id } = await this.verifyToken(accessToken);
    await this.accountService.findAccountById(Id);
    const user = await this.userService.findUserByAccountIdAndUserId(
      Id,
      userId,
    );
    return user;
  }
}
