import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/modules/users/users.service';
import { PrismaService } from 'src/modules/database-provider/prisma.service';
import { CompanyService } from 'src/modules/company/company.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';

const mockPrismaService = jest.fn().mockResolvedValue({
  users: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});
const mockCompanyService = jest.fn();
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CompanyService, useValue: mockCompanyService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all users', async () => {
    const mockUsers = [
      /* array of user objects */
    ];
    prisma.users.findMany.mockResolvedValueOnce(mockUsers);

    const users = await service.getAllUsers();

    expect(users).toEqual(mockUsers);
    expect(prisma.users.findMany).toHaveBeenCalled();
  });
});
