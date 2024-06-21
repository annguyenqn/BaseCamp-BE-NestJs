import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database-provider/prisma.service';
import { CompanyService } from '../company/company.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { Roles } from 'src/common/enum/Roles.enum';
@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private companyService: CompanyService,
    private accountService: AccountsService,
  ) {}

  async getAllUser() {
    return await this.prismaService.users.findMany({
      where: {
        deleted: {
          not: true,
        },
      },
    });
  }
  async findUserByAccountID(id: number) {
    const users = await this.prismaService.users.findMany({
      where: {
        accountId: id,
      },
    });
    if (!users) {
      throw new NotFoundException('Users is not found');
    }
    return users;
  }
  async findUserByAccountIdAndUserId(accountId: number, userId: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: +userId,
        accountId: accountId,
      },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    return user;
  }

  async findUserById(id: number) {
    if (!id) {
      throw new NotFoundException('Missing Id');
    }
    const user = await this.prismaService.users.findUnique({
      where: {
        id: id,
      },
      include: {
        contact: true,
        userProperty: {
          include: {
            properties: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByRole(role: Roles) {
    const users = await this.prismaService.users.findMany({
      where: {
        roles: role,
      },
    });
    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { accountId } = createUserDto;
    await this.accountService.findAccountById(accountId);
    const user = await this.prismaService.users.create({
      data: createUserDto,
    });
    return user;
  }
  async createUserFromAccount(
    req: Request,
    createUserAccountDto: CreateUserAccountDto,
  ) {
    const accId = req['user'].id;
    const account = await this.accountService.findAccountById(accId);
    const { companyId } = createUserAccountDto;
    await this.companyService.findCompanyById(companyId);
    const createUserData = {
      accountId: account.id,
      ...createUserAccountDto,
    };
    const user = await this.prismaService.users.create({
      data: createUserData,
    });
    return user;
  }

  async updateUser(Id: number, updateUserDto: UpdateUserDto) {
    const { ...updateFields } = updateUserDto;
    const user = await this.prismaService.users.update({
      where: { id: Id },
      data: {
        ...updateFields,
        updatedAt: new Date(),
      },
    });
    return user;
  }

  async removeUser(Id: number): Promise<void> {
    await this.findUserById(Id);
    const updatedUserData = {
      deleted: true,
      updatedAt: new Date(),
    };
    await this.prismaService.users.update({
      where: { id: Id },
      data: updatedUserData,
    });
  }
}
