// import { Test, TestingModule } from '@nestjs/testing';

// import { NotFoundException } from '@nestjs/common';

// import { CompanyController } from '../../src/modules/company/company.controller';

// import { CompanyService } from '../../src/modules/company/company.service';

// import { CreateCompanyDto } from '../../src/modules/company/dto/create-company.dto';

// import { UpdateCompanyDto } from '../../src/modules/company/dto/update-company.dto';

// import { forwardRef } from '@nestjs/common';
// const mockCompanyService = {
//     createCompany: jest.fn(),

//     updateCompany: jest.fn(),

//     removeCompany: jest.fn(),

//     findCompanyById: jest.fn(),

//     findAll: jest.fn(),
// } as unknown as jest.Mocked<CompanyService>;

// jest.mock('../../src/modules/company/company.service', () => ({
//     CompanyService: jest.fn(() => mockCompanyService),
// }));

// describe('CompanyController', () => {
//     let controller: CompanyController;

//     beforeEach(async () => {
//         jest.clearAllMocks();
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [CompanyController],
//             providers: [CompanyService],
//         }).compile();

//         controller = module.get<CompanyController>(CompanyController);

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
//             onboardTime: new Date('1013-01-01'), // Chuyển đổi kiểu string sang kiểu Date
//             archiveTime: null, // Nếu kiểu dữ liệu của archiveTime là Date, bạn có thể sử dụng new Date('1013-01-01') hoặc null tùy vào yêu cầu của bạn
//             companyMailbox: 'test@example.com',
//         };

//         mockCompanyService.createCompany.mockResolvedValue(expectedResult);

//         await expect(controller.create(createCompanyDto)).resolves.toEqual(
//             expectedResult,
//         );

//         expect(mockCompanyService.createCompany).toHaveBeenCalledWith(createCompanyDto);

//         // expect(service.createUser).toHaveBeenCalledWith(dto);
//     });

//     it('should call update method with userId and updateUserDto and return the updated user', async () => {
//         const companyId = 1;

//         const updateCompanyDto: UpdateCompanyDto = {
//             name: 'companyTestupdate',
//             onboardTime: null,
//             archiveTime: null,
//             companyMailbox: 'companyTest@gmail.com'
//         };

//         const expectedUpdatedCompany = {
//             companyId: companyId,
//             name: 'companyTestupdate',
//             onboardTime: null,
//             archiveTime: null,
//             companyMailbox: 'companyTest@gmail.com'
//         };

//         // Mock phương thức update của UsersService
//         mockCompanyService.updateCompany.mockResolvedValue(expectedUpdatedCompany);

//         // Gọi phương thức update và kiểm tra kết quả
//         const updateCompany = await controller.update(companyId, updateCompanyDto);

//         expect(updateCompany).toEqual(expectedUpdatedCompany);

//         // Kiểm tra xem service.update có được gọi với đối số đúng không
//         expect(mockCompanyService.updateCompany).toHaveBeenCalledWith(companyId, updateCompanyDto);
//     });
//     it('should return all users with their roles', async () => {
//         // Tạo dữ liệu giả định (mock data)

//         const mockCompany = [
//             {
//                 companyId: 1,
//                 name: 'Company A',
//                 onboardTime: new Date(),
//                 archiveTime: null,
//                 companyMailbox: 'company@example.com',
//                 users: [
//                     {
//                         userId: 1,
//                         email: 'user1@example.com',
//                         passwordHash: 'password',
//                         firstName: 'John',
//                         lastName: 'Doe',
//                         status: 'active',
//                         companyId: 1,
//                         hashedRt: null

//                     },
//                     {
//                         userId: 2,
//                         email: 'user2@example.com',
//                         passwordHash: 'password',
//                         firstName: 'Jane',
//                         lastName: 'Doe',
//                         status: 'active',
//                         companyId: 1,
//                         hashedRt: null

//                     }
//                 ],
//                 properties: [
//                     {
//                         propertyId: 1,
//                         companyId: 1,
//                         userId: 1, // Add userId here
//                         streetLine: '123 Main St',
//                         status: 'available',
//                         type: 'residential',
//                         hashedRt: null

//                     },
//                     {
//                         propertyId: 2,
//                         companyId: 1,
//                         userId: 2, // Add userId here
//                         streetLine: '456 Elm St',
//                         status: 'rented',
//                         type: 'commercial',
//                         hashedRt: null
//                     }
//                 ]
//             }
//         ];

//         mockCompanyService.findAll.mockResolvedValue(mockCompany);

//         const result = await mockCompanyService.findAll();

//         expect(result).toEqual(mockCompany);
//     });

//     it('should return the user when user is found', async () => {
//         const companyId = 1;

//         const mockCompany = {
//             "companyId": 1,
//             "name": "vinhouse",
//             "onboardTime": null,
//             "archiveTime": null,
//             "companyMailbox": "vinamilk@gmail.com",
//             "users": [
//                 {
//                     "userId": 9,
//                     "email": "Test@example.com",
//                     "passwordHash": "$1b$10$vUDz16tsb3OsskHrBSCY7uAYysI44gdUnKnDkNvHrlDrTr7GXU.km",
//                     "firstName": "demo test",
//                     "lastName": "User",
//                     "status": "active",
//                     "companyId": 1
//                 },
//                 {
//                     "userId": 10,
//                     "email": "user10@example.com",
//                     "passwordHash": "$1b$10$4GL7l1fkOW4AH311PrIGiu1tyRVfgsxA03NoEc1UG1ABK7pNMeSTK",
//                     "firstName": "Regular",
//                     "lastName": "User",
//                     "status": "active",
//                     "companyId": 1
//                 },
//                 {
//                     "userId": 17,
//                     "email": "Owner1@example.com",
//                     "passwordHash": "$1b$10$Y3IRHl79Fc6ApP06WhVwgeKWd1p1T1hRMQmcy3Og179n5yQ8/oSy6",
//                     "firstName": "Regular",
//                     "lastName": "User",
//                     "status": "active",
//                     "companyId": 1
//                 }
//             ],
//             "properties": [
//                 {
//                     "propertyId": 1,
//                     "companyId": 1,
//                     "streetLine": "quy nhon",
//                     "status": "pending",
//                     "type": "building"
//                 }
//             ]
//         };

//         mockCompanyService.findCompanyById.mockResolvedValue(mockCompany);

//         const result = await mockCompanyService.findCompanyById(companyId);

//         expect(result).toEqual(mockCompany);
//     });

//     it('should throw NotFoundException when user is not found', async () => {
//         const companyId = 1;

//         mockCompanyService.findCompanyById.mockRejectedValue(new NotFoundException());

//         await expect(mockCompanyService.findCompanyById(companyId)).rejects.toThrow(
//             NotFoundException,
//         );

//         expect(mockCompanyService.findCompanyById).toHaveBeenCalledWith(companyId);
//     });

//     it('should remove the user when user is found', async () => {
//         const companyId: number = 1;

//         mockCompanyService.removeCompany.mockResolvedValue(undefined);

//         await expect(mockCompanyService.removeCompany(companyId)).resolves.toBeUndefined();

//         expect(mockCompanyService.removeCompany).toHaveBeenCalledWith(companyId);
//     });
// });
