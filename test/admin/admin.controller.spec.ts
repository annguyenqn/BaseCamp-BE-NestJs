// import { Test, TestingModule } from '@nestjs/testing';
// import { AdminService } from '../../src/modules/admin/admin.service'
// import { AdminController } from '../../src/modules/admin/admin.controller';
// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { UsersService } from '../../src/modules/users/users.service';
// import { AgentService } from '../../src/modules/agent/agent.service';
// import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
// import { CreateCompanyDto } from 'src/modules/company/dto/create-company.dto';
// import { InvitationStatus } from '../../src/common/enum/InvitationStatus.enum';
// const mockAdminService = {
//     getListOfCompaniesWithCounts: jest.fn(),
//     getAgencies: jest.fn(),
//     changeRoleToAdmin: jest.fn(),
//     getAllCompaniesWithCounts: jest.fn(),
//     toggleAgentStatusForCompany: jest.fn(),
//     createCompany: jest.fn(),
//     createUser: jest.fn(),
// } as unknown as jest.Mocked<AdminService>

// const mockUserService = {
//     findUserById: jest.fn(),
// } as unknown as jest.Mocked<UsersService>

// const mockAgentService = {
//     findOne: jest.fn()
// } as unknown as jest.Mocked<AgentService>
// jest.mock('../../src/modules/admin/admin.service', () => ({
//     AdminService: jest.fn(() => mockAdminService),
// }));
// jest.mock('../../src/modules/users/users.service', () => ({
//     UsersService: jest.fn(() => mockUserService),
// }));

// jest.mock('../../src/modules/agent/agent.service', () => ({
//     AgentService: jest.fn(() => mockAgentService),
// }));
// describe('AdminController', () => {
//     let adminController: AdminController
//     beforeEach(async () => {
//         jest.clearAllMocks();

//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [AdminController],
//             providers: [AdminService, UsersService, AgentService],
//         }).compile();

//         adminController = module.get<AdminController>(AdminController);
//     });

//     it('should return View list of companies', async () => {

//         const expectedResult =
//             [
//                 {
//                     "companyId": 4,
//                     "name": "ssun21",
//                     "propertiesCount": 2,
//                     "unitCount": 0
//                 },
//                 {
//                     "companyId": 5,
//                     "name": "nccAsia",
//                     "propertiesCount": 1,
//                     "unitCount": 0
//                 },
//                 {
//                     "companyId": 3,
//                     "name": "Flcupdate",
//                     "propertiesCount": 0,
//                     "unitCount": 0
//                 },
//                 {
//                     "companyId": 2,
//                     "name": "vinhous2e",
//                     "propertiesCount": 3,
//                     "unitCount": 2
//                 }
//             ]

//         mockAdminService.getListOfCompaniesWithCounts.mockResolvedValue(expectedResult)
//         const result = await mockAdminService.getListOfCompaniesWithCounts();
//         expect(result).toEqual(expectedResult)
//     });
//     it('should throw NotFoundException when companies is not found', async () => {

//         mockAdminService.getListOfCompaniesWithCounts.mockRejectedValue(new NotFoundException());

//         await expect(mockAdminService.getListOfCompaniesWithCounts).rejects.toThrow(
//             NotFoundException,
//         );

//     });
//     it('should return View list of Angent', async () => {

//         const expectedResult: {
//             propertyAgentId: number;
//             propertyId: number;
//             agentUserId: number;
//             assignmentTime: Date;
//             status: InvitationStatus;
//         }[] = [
//                 {
//                     propertyAgentId: 1,
//                     propertyId: 1,
//                     agentUserId: 1,
//                     assignmentTime: new Date(),
//                     status: InvitationStatus.Pending,
//                 },
//                 // Add more objects as needed
//             ];

//         mockAdminService.getAgencies.mockResolvedValue(expectedResult)
//         const result = await mockAdminService.getAgencies();
//         expect(result).toEqual(expectedResult)
//     });
//     it('should throw NotFoundException when angentcies is not found', async () => {

//         mockAdminService.getAgencies.mockRejectedValue(new NotFoundException());

//         await expect(mockAdminService.getAgencies).rejects.toThrow(
//             NotFoundException,
//         );

//     });
//     it('should change role to admin the user when user is found', async () => {
//         const userId: number = 37;
//         const user = {
//             "userId": 37,
//             "email": "demouser213@example.com",
//             "passwordHash": "$2b$10$2Ws4Ryl8VXI7leSfEA1U9eTF6hcsB80Jv.i/8N/XXHy5tWgLl6w7q",
//             "firstName": "Regular",
//             "lastName": "User",
//             "status": "active",
//             "companyId": 5,
//             "hashedRt": null,
//             "roles": [
//                 {
//                     "roleId": 3,
//                     "roleName": "Admin"
//                 },
//                 {
//                     "roleId": 5,
//                     "roleName": "Agent"
//                 }
//             ]
//         }
//         const expectResult = {
//             "userId": 37,
//             "email": "demouser213@example.com",
//             "passwordHash": "$2b$10$tcylZ6OAkgO0gv5/epwvKOgMapw5zQ7tiGAhPIR..3lb4Zpi2xzPa",
//             "firstName": "Regular",
//             "lastName": "User",
//             "status": "active",
//             "companyId": 5,
//             "hashedRt": null,
//             "roles": [
//                 {
//                     "roleId": 3,
//                     "roleName": "Admin"
//                 },
//                 {
//                     "roleId": 5,
//                     "roleName": "Agent"
//                 }
//             ]
//         }

//         jest.spyOn(mockUserService, 'findUserById').mockResolvedValue(user);
//         jest.spyOn(mockAdminService, 'changeRoleToAdmin').mockResolvedValue(expectResult);

//         await expect(mockAdminService.changeRoleToAdmin(userId)).resolves.toEqual(expectResult);
//     });

//     it('shold throw ConflictException if user is already admin', async () => {
//         mockAdminService.changeRoleToAdmin.mockRejectedValue(new ConflictException());
//         await expect(mockAdminService.changeRoleToAdmin).rejects.toThrow(
//             ConflictException,
//         );
//     });
//     it('should activate an agent', async () => {
//         const agentId = 3;
//         const isActive = true;

//         // Mock findOne method of agentService
//         jest.spyOn(mockAgentService, 'findOne').mockResolvedValueOnce({

//             "propertyAgentId": 3,
//             "propertyId": 1,
//             "agentUserId": 1,
//             "assignmentTime": new Date(),
//             "status": "Failed"

//         });
//         jest.spyOn(mockAdminService, 'toggleAgentStatusForCompany').mockResolvedValueOnce({
//             "propertyAgentId": 3,
//             "propertyId": 1,
//             "agentUserId": 1,
//             "assignmentTime": new Date(),
//             "status": "Completed"
//         });

//         const result = await mockAdminService.toggleAgentStatusForCompany(agentId, isActive);
//         expect(result).toEqual({
//             "propertyAgentId": 3,
//             "propertyId": 1,
//             "agentUserId": 1,
//             "assignmentTime": expect.any(Date),
//             "status": "Completed"
//         });
//     });

//     it('should throw ConflictException if agent is already active', async () => {
//         mockAdminService.toggleAgentStatusForCompany.mockRejectedValueOnce(new ConflictException('User is already Active'));
//         const agentId = 3;
//         const isActive = true;
//         await expect(mockAdminService.toggleAgentStatusForCompany(agentId, isActive)).rejects.toThrowError(ConflictException);

//     });

//     it('should call create company and return the result', async () => {
//         const createCompanyDto: CreateCompanyDto = {
//             name: 'companyTest',
//             onboardTime: '1014-01-01',
//             archiveTime: '1014-01-01',
//             companyMailbox: 'companyTest@gmai.com'

//         };

//         const expectedResult = {
//             companyId: 1,
//             name: 'Test Company',
//             onboardTime: new Date('1013-01-01'),
//             archiveTime: null,
//             companyMailbox: 'test@example.com',
//         };

//         mockAdminService.createCompany.mockResolvedValue(expectedResult);

//         await expect(adminController.createCompanty(createCompanyDto)).resolves.toEqual(
//             expectedResult,
//         );

//         expect(mockAdminService.createCompany).toHaveBeenCalledWith(createCompanyDto);

//     });

//     it('should call createUser and return the result', async () => {
//         const createUserDto: CreateUserDto = {
//             email: 'test@example.com',

//             password: 'testpass',

//             firstName: 'Test',

//             lastName: 'User',

//             status: InvitationStatus.Pending,

//             roleNames: ['Admin'],

//             companyId: 2,
//             hashedRt: null,
//         };

//         const expectedResult = {
//             userId: 1,

//             email: createUserDto.email,

//             passwordHash: 'hashedPassword',

//             firstName: createUserDto.firstName || '',

//             lastName: createUserDto.lastName || '',

//             status: createUserDto.status,
//             hashedRt: null,

//             companyId: createUserDto.companyId,
//         };

//         mockAdminService.createUser.mockResolvedValue(expectedResult);

//         await expect(adminController.createUser(createUserDto)).resolves.toEqual(
//             expectedResult,
//         );

//         expect(mockAdminService.createUser).toHaveBeenCalledWith(createUserDto);
//     });
// })
