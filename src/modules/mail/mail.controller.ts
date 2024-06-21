import { Controller, Post, Body, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { mailDto } from './dto/mail.dto';
import { Public } from '../../common/decorators/public.decorator';
import { signUpDto } from './dto/signup.dto';
import { Roles } from 'src/common/enum/Roles.enum';
import { RolesDecorator } from '../../common/decorators/roles.decorator';
@ApiTags('Mail API')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @ApiBearerAuth('access-token')
  @Post('invite')
  @RolesDecorator(Roles.ADMIN)
  async sendInvitationEmail(@Body() mailDto: mailDto) {
    return await this.mailService.sendInvitationEmail(mailDto);
  }

  @Public()
  @Post('send-otp')
  async sendOtp(@Query('token') token: string, @Query('email') email: string) {
    return await this.mailService.sendOtp(token, email);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signupdata: signUpDto, @Query('token') token: string) {
    return await this.mailService.createUser(signupdata, token);
  }
}
