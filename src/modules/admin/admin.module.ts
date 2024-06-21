import { Module } from '@nestjs/common';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AccountsService } from '../accounts/accounts.service';
import { AccountsModule } from '../accounts/accounts.module';
import { CompanyService } from '../company/company.service';
import { CompanyModule } from '../company/company.module';
import { PropertiesModule } from '../properties/properties.module';
import { PropertiesService } from '../properties/properties.service';
import { AdminController } from './admin.controller';
@Module({
  imports: [
    DatabaseProviderModule,
    UsersModule,
    AccountsModule,
    CompanyModule,
    PropertiesModule,
  ],
  controllers: [AdminController],
  providers: [UsersService, CompanyService, PropertiesService, AccountsService],
  exports: [],
})
export class AdminModule {}
