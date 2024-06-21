import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from '../database-provider/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService) {}
  async getAllCompany() {
    try {
      const companies = await this.prismaService.companies.findMany({
        where: {
          deleted: {
            not: true,
          },
        },
        include: {
          accounts: true,
          properties: true,
        },
      });
      companies.forEach((company) => {
        delete company.deleted;
      });
      return companies;
    } catch (e) {
      throw new Error('Can not find all Company');
    }
  }
  async findCompanyById(id: number) {
    if (!id) {
      throw new NotFoundException('Missing company id');
    }
    const company = await this.prismaService.companies.findUnique({
      where: {
        id: id,
      },
      include: {
        accounts: true,
        properties: true,
      },
    });
    if (!company) {
      throw new NotFoundException('Company is not found');
    }
    delete company.deleted;
    return company;
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const data = {
      ...createCompanyDto,
    };
    const company = await this.prismaService.companies.create({
      data: data,
    });
    return company;
  }

  async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findCompanyById(id);

    if (company['deleted'] === true) {
      throw new NotFoundException('Company is  deleted');
    }
    const data = {
      ...updateCompanyDto,
      updatedAt: new Date(),
    };
    const userUpdate = this.prismaService.companies.update({
      where: { id },
      data: data,
    });
    return userUpdate;
  }

  async removeCompany(id: number) {
    await this.findCompanyById(id);
    const updatedCompanyData = {
      deleted: true,
      updatedAt: new Date(),
    };
    await this.prismaService.companies.update({
      where: { id },
      data: updatedCompanyData,
    });
  }
}
