import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UsersService } from '../users/users.service';
import { CompanyService } from '../company/company.service';
import { PrismaService } from '../database-provider/prisma.service';
@Injectable()
export class PropertiesService {
  constructor(
    private userService: UsersService,
    private companyService: CompanyService,
    private prismaService: PrismaService,
  ) { }
  async createProperty(
    accId: number,
    companyId: number,
    createPropertyDto: CreatePropertyDto,
  ) {
    const { userId, streetLine, parentId, status, type } = createPropertyDto;
    await this.userService.findUserByAccountID(accId);
    const user = await this.userService.findUserById(userId);
    if (user.roles !== 'OWNER') {
      throw new ConflictException('This user is not Owner role');
    }
    await this.companyService.findCompanyById(companyId);
    const property = await this.prismaService.properties.create({
      data: {
        companyId: companyId,
        streetLine: streetLine,
        parentId: parentId,
        status: status,
        type: type,
      },
    });
    if (property) {
      await this.prismaService.user_properties.create({
        data: {
          usersId: userId,
          propertiesId: property.id,
        },
      });
      return property;
    }
  }

  async findAllProperty() {
    return await this.prismaService.properties.findMany({
      where: {
        deleted: {
          not: true,
        },
      },
    });
  }
  async findUnitByPropertyId(id: number) {
    const Unit = await this.prismaService.properties.findMany({
      where: {
        parentId: id,
      },
    });
    if (!Unit) {
      throw new NotFoundException('Unit is not found');
    }
    return Unit;
  }
  async findPropertyById(id: number) {
    const property = await this.prismaService.properties.findUnique({
      where: {
        id: id,
      },
    });
    if (!property) {
      throw new NotFoundException('Property is not found');
    }
    const unit = await this.findUnitByPropertyId(id);
    const fullProperty = {
      ...property,
      unit,
    };
    return fullProperty;
  }

  async findPropertyByAccId(accId: number) {
    const users = await this.prismaService.users.findMany({
      where: {
        accountId: accId,
      },
      include: {
        userProperty: {
          include: {
            properties: true,
          },
        },
      },
    });
    const userProperty = users.map((item) => item.userProperty);
    const extractProperties = (data) => {
      return data
        .flat()
        .map((item) => item.properties)
        .filter((properties) => properties !== undefined);
    };
    const properties = extractProperties(userProperty);
    return properties;
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    await this.findPropertyById(id);
    const propertyUpdated = await this.prismaService.properties.update({
      where: {
        id: id,
      },
      data: updatePropertyDto,
    });
    return propertyUpdated;
  }

  async removeProperty(id: number) {
    await this.findPropertyById(id);
    const updatedUserData = {
      deleted: true,
      updatedAt: new Date(),
    };
    await this.prismaService.properties.update({
      where: { id: id },
      data: updatedUserData,
    });
  }
}
