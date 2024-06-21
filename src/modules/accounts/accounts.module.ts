import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { CompanyModule } from '../company/company.module';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [DatabaseProviderModule, CompanyModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
