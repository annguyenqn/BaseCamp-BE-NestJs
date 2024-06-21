import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guard/accessToken.guard';
import { MailModule } from './modules/mail/mail.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ContactModule } from './modules/contact/contact.module';
import { accessToken } from './common/middleware/accessToken.middleware';
import { AccountsService } from './modules/accounts/accounts.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { PropertiesModule } from './modules/properties/properties.module';
import { RolesGuard } from './modules/auth/guard/role.guard';
import { AdminModule } from './modules/admin/admin.module';
import { multiTenant } from './common/middleware/multiTenant.middleware';
import { FirebaseModule } from './modules/firebase/firebase.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AccountsModule,
    JwtModule,
    UsersModule,
    CompanyModule,
    ContactModule,
    MailModule,
    PropertiesModule,
    AdminModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccountsService,
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(accessToken)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'mail/send-otp', method: RequestMethod.POST },
        { path: 'mail/sign-up', method: RequestMethod.POST },
      )
      .forRoutes('*');

    consumer
      .apply(multiTenant)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'mail/send-otp', method: RequestMethod.POST },
        { path: 'mail/sign-up', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
