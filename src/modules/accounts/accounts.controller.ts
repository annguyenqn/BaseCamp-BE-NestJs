import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/enum/Roles.enum';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';

@ApiTags('Accounts API')
@Controller('accounts')
@ApiBearerAuth('access-token')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getAccountInfo(@Req() req: Request) {
    const id = req['user'].id;
    return this.accountsService.findAccountById(+id);
  }

  @Patch()
  update(@Req() req: Request, @Body() updateAccountDto: UpdateAccountDto) {
    const id = req['user'].id;
    return this.accountsService.updateAccount(+id, updateAccountDto);
  }
}
