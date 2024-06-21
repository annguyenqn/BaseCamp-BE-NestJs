import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { CompanyService } from '../company/company.service';
import { UsersService } from '../users/users.service';
import { CreateAccountDto } from '../accounts/dto/create-account.dto';
import { UpdateAccountDto } from '../accounts/dto/update-account.dto';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { UpdateCompanyDto } from '../company/dto/update-company.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/enum/Roles.enum';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
@ApiTags('Admins API')
@ApiBearerAuth('access-token')
@RolesDecorator(Roles.ADMIN)
@Controller('admins')
export class AdminController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly companyService: CompanyService,
    private readonly userService: UsersService,
  ) {}

  @Post('/accounts')
  createAcc(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Get('/accounts')
  findAllAcC() {
    return this.accountsService.findAllAccount();
  }

  @Get('/accounts/:id')
  findOneAcc(@Param('id') id: string) {
    return this.accountsService.findAccountById(+id);
  }

  @Patch('/accounts/:id')
  updateAccById(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(+id, updateAccountDto);
  }

  @Delete('/accounts/:id')
  removeAcc(@Param('id') id: string) {
    return this.accountsService.removeAccount(+id);
  }

  @Get('/companies')
  async findAllCompany() {
    return this.companyService.getAllCompany();
  }

  @Post('/companies')
  async createCompany(@Body() createcompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createcompanyDto);
  }

  @Get('/companies/:companyId')
  async findOneCompany(@Param('companyId') companyId: number) {
    return this.companyService.findCompanyById(+companyId);
  }

  @Patch('/companies/:companyId')
  async updateCompany(
    @Param('companyId') companyId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(+companyId, updateCompanyDto);
  }

  @Delete('/companies/:companyId')
  async deleteCompany(@Param('companyId') companyId: number) {
    return this.companyService.removeCompany(+companyId);
  }

  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('/users')
  findAllUser() {
    return this.userService.getAllUser();
  }

  @Get('users/:userId')
  async findOneUser(@Param('userId') userId: number) {
    return this.userService.findUserById(+userId);
  }
  // @Get('users/role')
  // async findUserByRole() {
  //     return this.userService.findUserById(+userId)
  // }

  @Patch('users/:userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+userId, updateUserDto);
  }
  @Delete('users/:userId')
  async removeUser(@Param('userId') userId: number) {
    return this.userService.removeUser(+userId);
  }
}
