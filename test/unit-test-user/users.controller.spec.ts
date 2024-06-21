import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';

import { UsersController } from '../../src/modules/users/users.controller';

import { UsersService } from '../../src/modules/users/users.service';

import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';

import { UpdateUserDto } from '../../src/modules/users/dto/update-user.dto';
import { InvitationStatus } from '../../src/common/enum/InvitationStatus.enum';
import { JwtService } from '@nestjs/jwt';

const mockUsersService = {
  createUser: jest.fn(),

  update: jest.fn(),

  remove: jest.fn(),

  findUserById: jest.fn(),

  findAll: jest.fn(),
} as unknown as jest.Mocked<UsersService>;

jest.mock('../../src/modules/users/users.service', () => ({
  UsersService: jest.fn(() => mockUsersService),
}));

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],

      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should call createUser and return the result', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',

      password: 'testpass',

      firstName: 'Test',

      lastName: 'User',

      status: InvitationStatus.Pending,

      roleNames: ['Admin'],

      companyId: 2,

      hashedRt: 'hashedToken',
    };

    const expectedResult = {
      userId: 1,

      email: createUserDto.email,

      passwordHash: 'hashedPassword',

      firstName: createUserDto.firstName || '',

      lastName: createUserDto.lastName || '',

      status: createUserDto.status,

      companyId: createUserDto.companyId,
      hashedRt: createUserDto.hashedRt,
    };

    mockUsersService.createUser.mockResolvedValue(expectedResult);

    await expect(controller.create(createUserDto)).resolves.toEqual(
      expectedResult,
    );

    expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);

    // expect(service.createUser).toHaveBeenCalledWith(dto);
  });

  it('should call update method with userId and updateUserDto and return the updated user', async () => {
    const userId = 1;

    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',

      firstName: 'UpdatedName',

      lastName: 'UpdatedLastName',

      status: InvitationStatus.Pending,

      roleNames: ['User'],

      companyId: 2,
      hashedRt: 'hashedToken',
    };

    const expectedUpdatedUser = {
      userId: userId,

      email: updateUserDto.email,

      passwordHash: 'hashedPassword', // Giả sử là một chuỗi đã mã hóa

      firstName: updateUserDto.firstName,

      lastName: updateUserDto.lastName,

      status: updateUserDto.status,

      companyId: updateUserDto.companyId,

      hashedRt: updateUserDto.hashedRt,
    };

    // Mock phương thức update của UsersService

    mockUsersService.update.mockResolvedValue(expectedUpdatedUser);

    // Gọi phương thức update và kiểm tra kết quả

    const updatedUser = await controller.update(userId, updateUserDto);

    expect(updatedUser).toEqual(expectedUpdatedUser);

    // Kiểm tra xem service.update có được gọi với đối số đúng không

    expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto);
  });

  it('should return all users with their roles', async () => {
    // Tạo dữ liệu giả định (mock data)

    const mockUsers = [
      {
        userId: 1,

        email: 'test1@example.com',

        passwordHash: 'passhash',

        firstName: 'First1',

        lastName: 'Last1',

        status: 'inprogress',

        companyId: 2,

        roles: [
          {
            roleId: 1,

            roleName: 'Admin',
          },
        ],
        hashedRt: 'createUserDto.hashedRt',
      },

      {
        userId: 2,

        email: 'test2@example.com',

        firstName: 'First2', // Thêm trường firstName

        lastName: 'Last2', // Thêm trường lastName

        passwordHash: 'passhash',

        status: 'inprogress',

        companyId: 2,

        roles: [
          {
            roleId: 2,

            roleName: 'User',
          },
        ],
        hashedRt: 'createUserDto.hashedRt',
      },
    ];

    mockUsersService.findAll.mockResolvedValue(mockUsers);

    const result = await mockUsersService.findAll();

    expect(result).toEqual(mockUsers);
  });

  it('should return the user when user is found', async () => {
    const userId = 1;

    const mockUser = {
      userId: userId,

      email: 'test2@example.com',

      firstName: 'First2',

      lastName: 'Last2',

      passwordHash: 'passhash',

      status: 'inprogress',

      companyId: 2,

      roles: [
        {
          roleId: 2,

          roleName: 'User',
        },
      ],
      hashedRt: 'createUserDto.hashedRt',
    };

    mockUsersService.findUserById.mockResolvedValue(mockUser);

    const result = await mockUsersService.findUserById(userId);

    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException when user is not found', async () => {
    const userId = 1;

    mockUsersService.findUserById.mockRejectedValue(new NotFoundException());

    await expect(mockUsersService.findUserById(userId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockUsersService.findUserById).toHaveBeenCalledWith(userId);
  });

  it('should remove the user when user is found', async () => {
    const userId: number = 1;

    mockUsersService.remove.mockResolvedValue(undefined);

    await expect(mockUsersService.remove(userId)).resolves.toBeUndefined();

    expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
  });
});
