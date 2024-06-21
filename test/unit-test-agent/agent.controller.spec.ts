import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';

import { AgentController } from '../../src/modules/agent/agent.controller';
import { AgentService } from '../../src/modules/agent/agent.service';
import { CreateAgentDto } from '../../src/modules/agent/dto/create-agent.dto';
import { UpdateAgentDto } from '../../src/modules/agent/dto/update-agent.dto';
import { InvitationStatus } from '../../src/common/enum/InvitationStatus.enum';
const mockAgentService = {
  create: jest.fn(),

  findAll: jest.fn(),

  findOne: jest.fn(),

  update: jest.fn(),

  remove: jest.fn(),
} as unknown as jest.Mocked<AgentService>;

jest.mock('../../src/modules/agent/agent.service', () => ({
  AgentService: jest.fn(() => mockAgentService),
}));

describe('AgentController', () => {
  let controller: AgentController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [AgentService],
    }).compile();

    controller = module.get<AgentController>(AgentController);
  });

  it('should call createagent and return the result', async () => {
    const createAgentDto: CreateAgentDto = {
      propertyId: 2,
      agentUserId: 9,
      assignmentTime: null,
      status: InvitationStatus.Pending,
    };
    const expectedResult = {
      propertyAgentId: 2,
      propertyId: 2,
      agentUserId: 9,
      assignmentTime: null,
      status: InvitationStatus.Pending,
    };

    mockAgentService.create.mockResolvedValue(expectedResult);

    await expect(controller.create(createAgentDto)).resolves.toEqual(
      expectedResult,
    );

    expect(mockAgentService.create).toHaveBeenCalledWith(createAgentDto);

    // expect(service.createagent).toHaveBeenCalledWith(dto);
  });

  it('should call update method with agentId and updateagentDto and return the updated agent', async () => {
    const agentId: number = 1;

    const updateagentDto: UpdateAgentDto = {
      propertyId: 2,
      agentUserId: 9,
      assignmentTime: null,
      status: InvitationStatus.Pending,
    };

    const expectedUpdatedagent = {
      propertyAgentId: agentId,
      propertyId: 2,
      agentUserId: 9,
      assignmentTime: null,
      status: InvitationStatus.Pending,
    };

    // Mock phương thức update của agentsService
    mockAgentService.update.mockResolvedValue(expectedUpdatedagent);

    // Gọi phương thức update và kiểm tra kết quả
    const updateagent = await controller.update(agentId, updateagentDto);

    expect(updateagent).toEqual(expectedUpdatedagent);

    // Kiểm tra xem service.update có được gọi với đối số đúng không
    expect(mockAgentService.update).toHaveBeenCalledWith(
      agentId,
      updateagentDto,
    );
  });
  it('should return all agents with their roles', async () => {
    // Tạo dữ liệu giả định (mock data)

    const mockagent = [
      {
        propertyAgentId: 2,
        propertyId: 2,
        agentUserId: 9,
        assignmentTime: null,
        status: InvitationStatus.Pending,
      },
    ];

    mockAgentService.findAll.mockResolvedValue(mockagent);

    const result = await mockAgentService.findAll();

    expect(result).toEqual(mockagent);
  });

  it('should return the agent when agent is found', async () => {
    const agentId = 2;

    const mockagent = {
      propertyAgentId: 2,
      propertyId: 2,
      agentUserId: 9,
      assignmentTime: null,
      status: InvitationStatus.Pending,
    };

    mockAgentService.findOne.mockResolvedValue(mockagent);

    const result = await mockAgentService.findOne(agentId);

    expect(result).toEqual(mockagent);
  });

  it('should throw NotFoundException when agent is not found', async () => {
    const agentId = 1;

    mockAgentService.findOne.mockRejectedValue(new NotFoundException());

    await expect(mockAgentService.findOne(agentId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockAgentService.findOne).toHaveBeenCalledWith(agentId);
  });

  it('should remove the agent when agent is found', async () => {
    const agentId: number = 1;

    mockAgentService.remove.mockResolvedValue(undefined);

    await expect(mockAgentService.remove(agentId)).resolves.toBeUndefined();

    expect(mockAgentService.remove).toHaveBeenCalledWith(agentId);
  });
});
