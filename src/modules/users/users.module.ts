import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CompanyModule } from '../company/company.module';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '../accounts/accounts.service';
import { ContactService } from '../contact/contact.service';
import { PropertiesService } from '../properties/properties.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [DatabaseProviderModule, CompanyModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    AccountsService,
    ContactService,
    PropertiesService,
    AuthService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
