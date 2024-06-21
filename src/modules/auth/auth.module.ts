import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { ConfigService } from '@nestjs/config';
import { AccountsModule } from '../accounts/accounts.module';
import { AccountsService } from '../accounts/accounts.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UsersService } from '../users/users.service';
import { CompanyModule } from '../company/company.module';
import { CompanyService } from '../company/company.service';
@Module({
  imports: [
    AccountsModule,
    CompanyModule,
    DatabaseProviderModule,
    JwtModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AccessTokenStrategy,
    CompanyService,
    RefreshTokenStrategy,
    AuthService,
    CompanyService,
    UsersService,
    ConfigService,
    AccountsService,
  ],
  exports: [AuthService],
})
export class AuthModule {
  constructor(private readonly configService: ConfigService) {}
}
