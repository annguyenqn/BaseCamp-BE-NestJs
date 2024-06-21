import { Controller, Get, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from '../contact/contact.service';
@ApiTags('Users API')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly contactService: ContactService,
  ) {}

  @Get('')
  async findUser(@Req() req: Request) {
    const id = req['user'].id;
    return this.usersService.findUserByAccountID(id);
  }

  @Get(':userId/contacts')
  async findContact(@Req() req: Request, @Query('userId') userId: string) {
    return this.contactService.findContactByUserId(req, +userId);
  }
}
