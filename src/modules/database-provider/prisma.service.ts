import { ShutdownService } from './../../shutdown.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private shutdownService: ShutdownService) {
    super();
  }
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      this.shutdownService.shutdown();
    }
  }
}
