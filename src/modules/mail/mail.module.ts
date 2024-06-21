import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AccountsService } from '../accounts/accounts.service';
import { DatabaseProviderModule } from '../database-provider/database-provider.module';
import { CompanyModule } from '../company/company.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MAIL_FROM,
  MAIL_PASS,
  MAIL_SERVICE,
  MAIL_USER,
  EMAIL_NOREPLY,
  MAIL_SERVICE_NAME,
} from './mail.constant';
@Module({
  imports: [
    DatabaseProviderModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>(
            `${MAIL_SERVICE}`,
            `${MAIL_SERVICE_NAME}`,
          ),
          auth: {
            user: configService.get<string>(`${MAIL_USER}`),
            pass: configService.get<string>(`${MAIL_PASS}`),
          },
        },
        defaults: {
          from: `"Invitation" <${configService.get<string>(`${MAIL_FROM}`, `${EMAIL_NOREPLY}`)}>`,
        },
      }),
    }),
    UsersModule,
    CompanyModule,
  ],
  controllers: [MailController],
  providers: [MailService, JwtService, AccountsService],
})
export class MailModule {}
