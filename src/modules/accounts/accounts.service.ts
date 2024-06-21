import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../database-provider/prisma.service';
import * as bcrypt from 'bcrypt';
import { CompanyService } from '../company/company.service';

@Injectable()
export class AccountsService {
  constructor(
    private prismaService: PrismaService,
    private companyService: CompanyService,
  ) {}
  async createAccount(createAccountDto: CreateAccountDto) {
    const { email, password, companyId } = createAccountDto;
    const emailFound = await this.findAccountByEmail(email);
    await this.companyService.findCompanyById(companyId);
    if (emailFound) {
      throw new ConflictException('Email is exist');
    }
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);
    const createAccountDtoHash = { ...createAccountDto };
    createAccountDtoHash.password = passwordHash;
    const Account = await this.prismaService.accounts.create({
      data: createAccountDtoHash,
    });
    return Account;
  }

  async findAllAccount() {
    const Accounts = await this.prismaService.accounts.findMany({
      where: {
        deleted: {
          not: true,
        },
      },
      include: {
        users: {
          include: {
            contact: true,
            userProperty: {
              include: {
                properties: true,
              },
            },
          },
        },
      },
    });
    return Accounts;
  }

  async findAccountById(id: number) {
    const Account = await this.prismaService.accounts.findUnique({
      where: {
        id: id,
      },
      include: {
        users: {
          include: {
            contact: true,
            userProperty: {
              include: {
                properties: true,
              },
            },
          },
        },
      },
    });
    if (!Account) {
      throw new NotFoundException('Account is not found');
    }
    return Account;
  }
  async findAccountByEmail(email: string) {
    const Account = await this.prismaService.accounts.findUnique({
      where: {
        email: email,
      },
    });
    return Account;
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    const { companyId, ...updateFields } = updateAccountDto;
    const company = await this.companyService.findCompanyById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const updateAccount = await this.prismaService.accounts.update({
      where: { id: id },
      data: {
        ...updateFields,
        companyId: companyId !== undefined ? companyId : undefined,
        updatedAt: new Date(),
      },
    });
    return updateAccount;
  }

  async removeAccount(id: number) {
    await this.findAccountById(id);
    const updatedData = {
      deleted: true,
      updatedAt: new Date(),
    };
    await this.prismaService.accounts.update({
      where: { id: id },
      data: updatedData,
    });
  }
}
