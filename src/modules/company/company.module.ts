import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
@Module({
  imports: [DatabaseProviderModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
