import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';

import { UnitController } from '../../src/modules/unit/unit.controller';
import { UnitService } from '../../src/modules/unit/unit.service';
import { CreateUnitDto } from '../../src/modules/unit/dto/create-unit.dto';
import { UpdateUnitDto } from '../../src/modules/unit/dto/update-unit.dto';

const mockUnitService = {
  create: jest.fn(),

  findAll: jest.fn(),

  findOne: jest.fn(),

  update: jest.fn(),

  remove: jest.fn(),
} as unknown as jest.Mocked<UnitService>;

jest.mock('../../src/modules/unit/unit.service', () => ({
  UnitService: jest.fn(() => mockUnitService),
}));

describe('UnitController', () => {
  let controller: UnitController;

  beforeAll(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitController],
      providers: [UnitService],
    }).compile();

    controller = module.get<UnitController>(UnitController);
  });

  it('should call createUnit and return the result', async () => {
    const createUnitDto: CreateUnitDto = {
      propertyId: 2,
      streetLine: 'nguyen thi dinh',
      status: 'sold',
    };

    const expectedResult = {
      unitId: 1,
      propertyId: 2,
      streetLine: 'nguyen thi dinh',
      status: 'sold',
    };

    mockUnitService.create.mockResolvedValue(expectedResult);

    await expect(controller.create(createUnitDto)).resolves.toEqual(
      expectedResult,
    );

    expect(mockUnitService.create).toHaveBeenCalledWith(createUnitDto);

    // expect(service.createUnit).toHaveBeenCalledWith(dto);
  });

  it('should call update method with UnitId and updateUnitDto and return the updated Unit', async () => {
    const unitId: number = 1;

    const updateUnitDto: UpdateUnitDto = {
      propertyId: 2,
      streetLine: 'nguyen thi dinh updated',
      status: 'sold',
    };

    const expectedUpdatedUnit = {
      unitId: unitId,
      propertyId: 2,
      streetLine: 'nguyen thi dinh updated',
      status: 'sold',
    };

    // Mock phương thức update của UnitsService
    mockUnitService.update.mockResolvedValue(expectedUpdatedUnit);

    // Gọi phương thức update và kiểm tra kết quả
    const updateUnit = await controller.update(unitId, updateUnitDto);

    expect(updateUnit).toEqual(expectedUpdatedUnit);

    // Kiểm tra xem service.update có được gọi với đối số đúng không
    expect(mockUnitService.update).toHaveBeenCalledWith(unitId, updateUnitDto);
  });
  it('should return all Units with their roles', async () => {
    // Tạo dữ liệu giả định (mock data)

    const mockUnit = [
      {
        unitId: 2,
        propertyId: 2,
        streetLine: 'nguyen thi dinh',
        status: 'sold',
      },
    ];

    mockUnitService.findAll.mockResolvedValue(mockUnit);

    const result = await mockUnitService.findAll();

    expect(result).toEqual(mockUnit);
  });

  it('should return the Unit when Unit is found', async () => {
    const unitId = 2;

    const mockUnit = {
      unitId: 2,
      propertyId: 2,
      streetLine: 'nguyen thi dinh',
      status: 'sold',
    };

    mockUnitService.findOne.mockResolvedValue(mockUnit);

    const result = await mockUnitService.findOne(unitId);

    expect(result).toEqual(mockUnit);
  });

  it('should throw NotFoundException when Unit is not found', async () => {
    const unitId = 1;

    mockUnitService.findOne.mockRejectedValue(new NotFoundException());

    await expect(mockUnitService.findOne(unitId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockUnitService.findOne).toHaveBeenCalledWith(unitId);
  });

  it('should remove the Unit when Unit is found', async () => {
    const unitId: number = 1;

    mockUnitService.remove.mockResolvedValue(undefined);

    await expect(mockUnitService.remove(unitId)).resolves.toBeUndefined();

    expect(mockUnitService.remove).toHaveBeenCalledWith(unitId);
  });
});
