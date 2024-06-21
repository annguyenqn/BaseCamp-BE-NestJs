import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './common/app-config';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors();
  app.get(ConfigService);
  appConfig(app);
  await app.listen(3001);
}
bootstrap();
