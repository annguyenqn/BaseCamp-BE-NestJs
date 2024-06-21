import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { mailDto } from './dto/mail.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { InvitationStatus } from 'src/common/enum/InvitationStatus.enum';
import { signUpDto } from './dto/signup.dto';
import {
    HOST,
    INVITE_SUBJECT,
    INVITE_TEXT,
    OTP_SUBJECT,
    OTP_TEXT,
    SECRET,
    TIME_EXPIRE,
} from './mail.constant';
import { AccountsService } from '../accounts/accounts.service';
import { PrismaService } from '../database-provider/prisma.service';
import { CompanyService } from '../company/company.service';
@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UsersService,
        private accountService: AccountsService,
        private prismaService: PrismaService,
        private companyService: CompanyService,
    ) { }
    private async generateOtp(length: number = 6) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            otp += digits[randomIndex];
        }
        return otp;
    }
    private async generateToken(companyId: number, role: string) {
        const token = await this.jwtService.signAsync(
            { companyId: companyId, role: role },
            {
                secret: this.configService.get<string>(`${SECRET}`),
                expiresIn: `${TIME_EXPIRE}`,
            },
        );
        return token;
    }

    private generateInvitationEmailHTML(
        firstName: string,
        lastName: string,
        companyName: string,
        role: string,
        inviteLink: string,
        companyMailbox: string,
    ): string {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation to Join ${companyName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          h2 {
            font-size: 24px;
            margin-bottom: 15px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          a {
            color: #337ab7;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${firstName} ${lastName}</h2>
          <p>I invite you to join ${companyName} with the role of ${role}.</p>
          <p>Click on the link below to accept the invitation:</p>
          <p><a href="${inviteLink}">Join ${companyName}</a></p>
          <p>For any questions, please contact us at  ${companyMailbox}.</p>
        </div>
      </body>
      </html>
      `;
    }
    private generateOtpEmailHTML(OTP_SUBJECT: string, otp: number) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${OTP_SUBJECT}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    h2 {
      font-size: 24px;
      margin-bottom: 15px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .otp-code {
      font-size: 24px;
      font-weight: bold;
      color: #337ab7;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
<div class="container">
<h2>Verification OTP</h2>
<p>Hello,</p>
<p>Your OTP for verification is:</p>
<p class="otp-code">${otp.toString()}</p>
<p>Please use this OTP within 5 minutes.</p>
<p>Please note: This OTP is for your use only and should not be shared with anyone else.</p>
</div>
</body>
</html>
`;
    }
    async sendInvitationEmail(mailDto: mailDto) {
        const { companyId, role, email, firstName, lastName } = mailDto;
        const company = await this.companyService.findCompanyById(companyId);
        const token = await this.generateToken(companyId, role);
        const inviteLink = `${HOST}${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: `${INVITE_SUBJECT}`,
            html: this.generateInvitationEmailHTML(
                firstName,
                lastName,
                company.name,
                role,
                inviteLink,
                company.companyMailbox,
            ),
        });
    }
    private async verifyToken(token: string) {
        const decodedToken = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>(`${SECRET}`),
        });
        return decodedToken;
    }
    async generateUniqueOTP(): Promise<string> {
        let otp: string;
        let existOtp;
        do {
            otp = await this.generateOtp();
            existOtp = await this.prismaService.otps.findFirst({
                where: {
                    otpCode: otp,
                },
            });
        } while (existOtp);

        return otp;
    }

    async sendOtp(token: string, email: string) {
        const decodeToken = await this.verifyToken(token);
        if (decodeToken) {
            const expiredAt = new Date();
            expiredAt.setMinutes(expiredAt.getMinutes() + 5);
            const otp = await this.generateUniqueOTP();
            await this.prismaService.otps.create({
                data: {
                    otpCode: otp,
                    expiredAt: expiredAt,
                },
            });
            await this.mailerService.sendMail({
                to: email,
                subject: `${OTP_SUBJECT}`,
                html: this.generateOtpEmailHTML(OTP_SUBJECT, +otp),
            });
        }
    }
    private async verifyOtp(enteredOtp: string) {
        const otpRecord = await this.prismaService.otps.findFirst({
            where: {
                otpCode: enteredOtp,
                expiredAt: {
                    gte: new Date(),
                },
            },
        });
        if (!otpRecord) {
            throw new Error('OTP Invalid');
        }
    }
    async createUser(signupdata: signUpDto, token: string) {
        const { email, enteredOtp, firstName, lastName, password } = signupdata;
        const { companyId, role } = await this.verifyToken(token);
        await this.verifyOtp(enteredOtp);
        const account = await this.accountService.createAccount({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            companyId: companyId,
        });
        if (account) {
            const user = await this.userService.createUser({
                accountId: account.id,
                isActive: 0,
                invitationStatus: InvitationStatus.PENDING,
                roles: role,
            });
            return user;
        }
    }
}
