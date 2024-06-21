import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';

import { PropertyController } from '../../src/modules/property/property.controller';
import { PropertyService } from '../../src/modules/property/property.service';
import { CreatePropertyDto } from '../../src/modules/property/dto/create-property.dto';
import { UpdatePropertyDto } from '../../src/modules/property/dto/update-property.dto';
import { InvitationStatus } from '../../src/common/enum/InvitationStatus.enum';

const mockPropertyService = {
  findAll: jest.fn(),

  findPropertyByID: jest.fn(),

  createProperty: jest.fn(),

  updateProperty: jest.fn(),

  deleteProperty: jest.fn(),
} as unknown as jest.Mocked<PropertyService>;

jest.mock('../../src/modules/property/property.service', () => ({
  PropertyService: jest.fn(() => mockPropertyService),
}));

describe('PropertyController', () => {
  let controller: PropertyController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [PropertyService],
    }).compile();

    controller = module.get<PropertyController>(PropertyController);
  });

  it('should call create property and return the result', async () => {
    const CreatePropertyDto: CreatePropertyDto = {
      companyId: 2,
      userId: 2,
      streetLine: 'quy nhon',
      status: InvitationStatus.Pending,
      type: 'building',
    };

    const expectedResult = {
      propertyId: 1,
      companyId: 2,
      userId: 2,
      streetLine: 'quy nhon',
      status: 'pending',
      type: 'building',
    };

    mockPropertyService.createProperty.mockResolvedValue(expectedResult);

    await expect(controller.create(CreatePropertyDto)).resolves.toEqual(
      expectedResult,
    );

    expect(mockPropertyService.createProperty).toHaveBeenCalledWith(
      CreatePropertyDto,
    );

    // expect(service.createUser).toHaveBeenCalledWith(dto);
  });

  it('should call update method with userId and updateUserDto and return the updated user', async () => {
    const propertyId: number = 1;

    const UpdatePropertyDto: UpdatePropertyDto = {
      companyId: 2,
      streetLine: 'quy nhon',
      userId: 2,
      status: InvitationStatus.Pending,
      type: 'building',
    };

    const expectedUpdatedProperty = {
      propertyId: propertyId,
      companyId: 2,
      userId: 2,
      streetLine: 'quy nhon updated',
      status: 'pending',
      type: 'building',
    };

    // Mock phương thức update của UsersService
    mockPropertyService.updateProperty.mockResolvedValue(
      expectedUpdatedProperty,
    );

    // Gọi phương thức update và kiểm tra kết quả
    const updateUnit = await controller.update(propertyId, UpdatePropertyDto);

    expect(updateUnit).toEqual(expectedUpdatedProperty);

    // Kiểm tra xem service.update có được gọi với đối số đúng không
    expect(mockPropertyService.updateProperty).toHaveBeenCalledWith(
      propertyId,
      UpdatePropertyDto,
    );
  });
  it('should return all users with their roles', async () => {
    // Tạo dữ liệu giả định (mock data)

    const mockProperty = [
      {
        propertyId: 2,
        companyId: 2,
        userId: 2,
        streetLine: 'quy nhon',
        status: InvitationStatus.Pending,
        type: 'building',
        units: [
          {
            unitId: 2,
            propertyId: 2,
            streetLine: 'nguyen thi dinh',
            status: 'sold',
          },
        ],
        propertyAgents: [
          {
            propertyAgentId: 2,
            propertyId: 2,
            agentUserId: 9,
            assignmentTime: null,
            status: InvitationStatus.Pending,
          },
        ],
      },
    ];

    mockPropertyService.findAll.mockResolvedValue(mockProperty);

    const result = await mockPropertyService.findAll();

    expect(result).toEqual(mockProperty);
  });

  it('should return the user when user is found', async () => {
    const propertyId = 2;

    const mockProperty = {
      agent: {
        userId: 1,
        email: 'agent@example.com',
        passwordHash: 'password',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        companyId: 1,
        hashedRt: null,
      },
      propertyId: 1,
      companyId: 1,
      userId: 1,
      streetLine: '123 Main St',
      status: InvitationStatus.Pending,
      type: 'residential',
    };

    mockPropertyService.findPropertyByID.mockResolvedValue(mockProperty);

    const result = await mockPropertyService.findPropertyByID(propertyId);

    expect(result).toEqual(mockProperty);
  });

  it('should throw NotFoundException when property is not found', async () => {
    const propertyId = 1;

    mockPropertyService.findPropertyByID.mockRejectedValue(
      new NotFoundException(),
    );

    await expect(
      mockPropertyService.findPropertyByID(propertyId),
    ).rejects.toThrow(NotFoundException);

    expect(mockPropertyService.findPropertyByID).toHaveBeenCalledWith(
      propertyId,
    );
  });

  it('should deleteProperty the user when property is found', async () => {
    const propertyId: number = 1;

    mockPropertyService.deleteProperty.mockResolvedValue(undefined);

    await expect(
      mockPropertyService.deleteProperty(propertyId),
    ).resolves.toBeUndefined();

    expect(mockPropertyService.deleteProperty).toHaveBeenCalledWith(propertyId);
  });
});
