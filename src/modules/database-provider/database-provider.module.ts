import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { getProvider } from '.';
import { ShutdownService } from 'src/shutdown.service';

const providers = getProvider();

@Global()
@Module({
  providers: [ShutdownService, PrismaService, ...providers],
  exports: [PrismaService, ...providers],
})
export class DatabaseProviderModule {}
