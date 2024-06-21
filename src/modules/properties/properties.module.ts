import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { UsersModule } from '../users/users.module';
import { CompanyModule } from '../company/company.module';
@Module({
  imports: [UsersModule, CompanyModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
