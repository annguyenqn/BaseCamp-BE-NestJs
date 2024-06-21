import { Inject, Provider } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

type repositoryTypes = 'UserRepository';
export const REPSOTIORY_CONFIG: Record<repositoryTypes, keyof PrismaClient> = {
  ['UserRepository']: 'users',
};
export const InjectRepository = (
  repositoryType: repositoryTypes,
): ReturnType<typeof Inject> => Inject(repositoryType);

export const getProvider = (): Provider[] =>
  Object.entries(REPSOTIORY_CONFIG).map(([repositoryType, repositoryName]) => ({
    provide: repositoryType,
    useFactory: (prismaService: PrismaService) =>
      prismaService[repositoryName as keyof PrismaService],
    inject: [PrismaService],
  }));
