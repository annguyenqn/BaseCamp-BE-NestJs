import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../database-provider/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateContactPropertyDto } from './dto/create-contact-property.dto';
import { AccountsService } from '../accounts/accounts.service';
@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
    private accountService: AccountsService,
  ) {}

  async createUserContact(createContactDto: CreateContactDto) {
    const { userId } = createContactDto;
    await this.userService.findUserById(userId);
    const contact = await this.prismaService.contacts.create({
      data: createContactDto,
    });
    return contact;
  }

  async createPropertyContact(
    createContactPropertyDto: CreateContactPropertyDto,
    userPropertyId: number,
  ) {
    const userProperty = await this.prismaService.user_properties.findUnique({
      where: {
        id: userPropertyId,
      },
    });
    if (!userProperty) {
      throw new NotFoundException('User Property Not Found');
    }
    const createData = {
      userId: userProperty.usersId,
      ...createContactPropertyDto,
    };
    const contact = await this.prismaService.contacts.create({
      data: createData,
    });
    if (contact) {
      await this.prismaService.user_properties_contacts.create({
        data: {
          userPropertyId: userPropertyId,
          contactsId: contact.id,
        },
      });
      return contact;
    }
  }

  async findAllContact(accId: number) {
    const users = await this.prismaService.users.findMany({
      where: {
        accountId: accId,
      },
      include: {
        contact: true,
      },
    });
    const contacts = users.map((item) => item.contact);
    const filteredData = contacts.flat().filter((item) => !item.deleted);
    return filteredData;
  }

  async findContactById(id: number) {
    const contact = await this.prismaService.contacts.findUnique({
      where: {
        id: id,
      },
    });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async findContactByUserId(req: Request, userId: number) {
    const accId = req['user'].id;
    const account = await this.accountService.findAccountById(accId);
    const user = account.users.find((user) => user.id === userId);
    if (!user) {
      throw new NotFoundException('User is not exist in this account');
    }
    const contact = await this.prismaService.contacts.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!contact) {
      throw new NotFoundException(`Contact with UserId ${userId} not found`);
    }
    return contact;
  }

  async findContactByUserPropertyId(userPropertyId: number) {
    const userProperty = await this.prismaService.user_properties.findUnique({
      where: {
        id: userPropertyId,
      },
    });
    if (!userProperty) {
      throw new NotFoundException('User Property Not Found');
    }
    const userPropertyContact =
      await this.prismaService.user_properties_contacts.findMany({
        where: {
          userPropertyId: userPropertyId,
        },
      });
    console.log('user property contact', userPropertyContact);

    if (userPropertyContact) {
      const contact = await this.prismaService.contacts.findMany({
        where: {
          userPropertyContact: {
            some: {
              userPropertyId: userPropertyId,
            },
          },
        },
      });
      return contact;
    }
    throw new NotFoundException('Contact Not Found');
  }

  async updateContact(id: number, updateContactDto: UpdateContactDto) {
    const { userId, ...updateFields } = updateContactDto;
    if (userId !== undefined) {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('Company not found');
      }
    }
    const contact = await this.prismaService.contacts.update({
      where: { id: id },
      data: {
        ...updateFields,
        userId: userId !== undefined ? userId : undefined,
        updatedAt: new Date(),
      },
    });
    return contact;
  }

  async removeContact(id: number) {
    await this.findContactById(id);
    const updatedUserData = {
      deleted: true,
      updatedAt: new Date(),
    };
    await this.prismaService.contacts.update({
      where: { id: id },
      data: updatedUserData,
    });
  }
}
