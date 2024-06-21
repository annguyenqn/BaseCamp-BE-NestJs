import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/modules/database-provider/prisma.service';
import {
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { CompanyService } from '../../src/modules/company/company.service';
import { ShutdownService } from '../../src/shutdown.service';
import { SignInDto } from 'src/modules/auth/dto';
import { AccessTokenGuard } from '../../src/modules/auth/guard/accessToken.guard';
import { RefreshTokenGuard } from '../../src/modules/auth/guard/refreshToken.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../src/modules/auth/guard/role.guard';
import { Role } from '../../src/common/enum/role.enum';
import { ROLES_KEY } from '../../src/common/decorators/roles.decorator';
describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let companyService: CompanyService;
  let guard: AccessTokenGuard;
  let reflector: Reflector;
  const mockContext: ExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToHttp: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        PrismaService,
        CompanyService,
        ShutdownService,
        AccessTokenGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    companyService = module.get<CompanyService>(CompanyService);
    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
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

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'existing@example.com',
      password: 'correctPassword',
    };
    it('should throw NotFoundException if email does not exist', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce({
          userId: 1,
          email: 'nonexistent@example.com',
          passwordHash: 'hashedPassword',
          firstName: 'John',
          lastName: 'Doe',
          status: 'active',
          companyId: 1,
          hashedRt: 'hashedRefreshToken',
        });

      await expect(authService.signIn(signInDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce({
          userId: 1,
          email: 'nonexistent@example.com',
          passwordHash: 'hashedPassword',
          firstName: 'John',
          lastName: 'Doe',
          status: 'active',
          companyId: 1,
          hashedRt: 'hashedRefreshToken',
        });

      jest
        .spyOn(authService, 'getToken')
        .mockResolvedValueOnce({
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
        });

      await expect(authService.signIn(signInDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    // it('should return tokens if credentials are correct', async () => {

    //     const user = { userId: 1, email: 'existing@example.com', passwordHash: 'correctPassword', firstName: 'John', lastName: 'Doe', status: 'active', companyId: 1, hashedRt: 'hashedRefreshToken' };
    //     jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(user);
    //     jest.spyOn(authService, 'getToken').mockResolvedValueOnce({ access_token: 'accessToken', refresh_token: 'refreshToken' });
    //     jest.spyOn(authService, 'updateRtHash').mockResolvedValueOnce(undefined);

    //     const tokens = await authService.signIn(signInDto);

    //     expect(tokens).toEqual({ access_token: 'accessToken', refresh_token: 'refreshToken' });
    // });
  });

  // describe('Token Guard', () => {
  //     it('should be defined', () => {
  //         expect(guard).toBeDefined();
  //     });
  //     it('should return true for public routes', async () => {
  //         reflector.getAllAndOverride = jest.fn().mockReturnValue(true);

  //         const result = await guard.canActivate(mockContext);

  //         expect(result).toEqual(true);
  //     });
  //     it('should call super.canActivate for non-public routes', async () => {
  //         // Mock reflector để trả về false cho isPublic
  //         reflector.getAllAndOverride = jest.fn().mockReturnValue(false);

  //         // Mock phương thức canActivate của guard cha
  //         const superCanActivateSpy = jest.spyOn(AccessTokenGuard.prototype, 'canActivate').mockImplementation(() => Promise.resolve(true));

  //         await guard.canActivate(mockContext);

  //         expect(superCanActivateSpy).toHaveBeenCalledWith(mockContext);
  //     });
  //     it('should handle errors during authentication', async () => {
  //         // Mock reflector để trả về false cho isPublic
  //         reflector.getAllAndOverride = jest.fn().mockReturnValue(false);

  //         // Mock phương thức canActivate của guard cha trả về một lỗi
  //         const errorMessage = 'Authentication error';
  //         const superCanActivateSpy = jest.spyOn(AccessTokenGuard.prototype, 'canActivate').mockRejectedValueOnce(new Error(errorMessage));

  //         // Kiểm tra xem guard của bạn xử lý lỗi như thế nào
  //         await expect(guard.canActivate(mockContext)).rejects.toThrowError(errorMessage);
  //     });
  //     it('should return true for public routes', async () => {
  //         const guard = new RefreshTokenGuard();
  //         const authGuardMock = {
  //             canActivate: jest.fn().mockReturnValue(true) // Thay đổi giá trị trả về tùy theo trường hợp kiểm tra
  //         };

  //         // Mock super.canActivate để không cần thiết khi route là công cộng
  //         const superCanActivateSpy = jest.spyOn(authGuardMock, 'canActivate');

  //         const result = await guard.canActivate(mockContext);

  //         expect(result).toEqual(true);

  //         // Đảm bảo rằng super.canActivate không được gọi
  //         expect(superCanActivateSpy).not.toHaveBeenCalled();
  //     });
  //     it('should call super.canActivate for non-public routes', async () => {
  //         const guard = new RefreshTokenGuard();
  //         const authGuardMock = {
  //             canActivate: jest.fn().mockReturnValue(true) // Thay đổi giá trị trả về tùy theo trường hợp kiểm tra
  //         };

  //         // Mock super.canActivate để trả về true khi route không phải là công cộng
  //         const superCanActivateSpy = jest.spyOn(authGuardMock, 'canActivate');

  //         const result = await guard.canActivate(mockContext);

  //         expect(result).toEqual(true);

  //         // Đảm bảo rằng super.canActivate được gọi
  //         expect(superCanActivateSpy).toHaveBeenCalled();
  //     });
  //     it('should handle errors during authentication', async () => {
  //         const guard = new RefreshTokenGuard();

  //         // Mock super.canActivate để trả về một lỗi
  //         const errorMessage = 'Authentication error';
  //         const superCanActivateSpy = jest.spyOn(AuthGuard.prototype, 'canActivate').mockRejectedValueOnce(new Error(errorMessage));

  //         // Kiểm tra xem guard của bạn xử lý lỗi như thế nào
  //         await expect(guard.canActivate(mockContext)).rejects.toThrowError(errorMessage);
  //     });

  // })

  // describe('Role Guard', () => {
  //     function createMockExecutionContext(roles: Role[]): ExecutionContext {
  //         return {
  //             switchToHttp: () => ({
  //                 getRequest: () => ({
  //                     user: { roles }
  //                 })
  //             })
  //         } as ExecutionContext;
  //     }
  //     it('should allow access if no roles are required', () => {
  //         const guard = new RolesGuard(new Reflector());

  //         const mockContext = createMockExecutionContext([]);

  //         const canActivateResult = guard.canActivate(mockContext);

  //         expect(canActivateResult).toEqual(true);
  //     });

  //     it('should deny access if user does not have required roles', () => {
  //         const guard = new RolesGuard(new Reflector());

  //         const mockContext = createMockExecutionContext([Role.Admin]);
  //         const mockUser = {
  //             roles: [Role.Admin]
  //         };
  //         const canActivateResult = guard.canActivate(mockContext);
  //         expect(canActivateResult).toEqual(false);
  //     });
  // })
  describe('refreshTokens', () => {
    it('should throw ForbiddenException if user or hashed refresh token does not exist', async () => {
      jest.spyOn(usersService, 'findUserById').mockResolvedValueOnce(null);

      await expect(
        authService.refreshTokens(1, 'refreshToken'),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw ForbiddenException if provided refresh token does not match stored hash', async () => {
      const user = {
        userId: 1,
        email: 'nonexistent@example.com',
        passwordHash: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        companyId: 1,
        hashedRt: 'hashedRefreshToken',
        roles: [{ roleId: 1, roleName: 'Admin' }],
      };
      jest.spyOn(usersService, 'findUserById').mockResolvedValueOnce(user);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false);

      await expect(
        authService.refreshTokens(1, 'refreshToken'),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should return new tokens if refresh token matches stored hash', async () => {
      const user = {
        userId: 1,
        email: 'nonexistent@example.com',
        passwordHash: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        companyId: 1,
        hashedRt: 'hashedRefreshToken',
        roles: [{ roleId: 1, roleName: 'Admin' }],
      };
      jest.spyOn(usersService, 'findUserById').mockResolvedValueOnce(user);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);
      jest
        .spyOn(authService, 'getToken')
        .mockResolvedValueOnce({
          access_token: 'newAccessToken',
          refresh_token: 'newRefreshToken',
        });
      jest.spyOn(authService, 'updateRtHash').mockResolvedValueOnce(undefined);

      const tokens = await authService.refreshTokens(1, 'refreshToken');

      expect(tokens).toEqual({
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      });
    });
  });
});
