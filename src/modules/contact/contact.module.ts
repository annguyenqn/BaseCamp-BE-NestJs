import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { UsersModule } from '../users/users.module';
import { AccountsService } from '../accounts/accounts.service';
import { userPropertiesController } from './contact.controller';
import { CompanyModule } from '../company/company.module';
import { AccountsModule } from '../accounts/accounts.module';
@Module({
  imports: [DatabaseProviderModule, UsersModule, AccountsModule, CompanyModule],
  controllers: [ContactController, userPropertiesController],
  providers: [ContactService, AccountsService],
})
export class ContactModule {}
