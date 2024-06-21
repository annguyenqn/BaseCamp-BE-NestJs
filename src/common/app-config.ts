import { AppConstant } from './constants/index';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ShutdownService } from 'src/shutdown.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { queueDashboardConfig } from './queue-dashboard.config';
export const appConfig = async (app: INestApplication) => {
  // queueDashboardConfig(app);
  // app.get(ShutdownService).subscribeToShutdown(() => app.close());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.setGlobalPrefix(APP_BASE_URLPREFIX);
  // app.use('*', (req, res: Response, next) => {
  //   // if (
  //   //   // AppConstant.APPLICATION_READY_STATE === HttpStatus.SERVICE_UNAVAILABLE
  //   // ) {
  //   return res.sendStatus(HttpStatus.SERVICE_UNAVAILABLE);
  //   // }
  //   next();
  // });
  const config = new DocumentBuilder()
    .setTitle('Base Camp')
    .setDescription('The Base Camp API')
    .setVersion('0.1')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      security: [{ bearer: [] }],
    },
  });
  // startMicroservice(app);
};

// async function startMicroservice(app: INestApplication) {
//   try {
//     await app.startAllMicroservices();
//     AppConstant.APPLICATION_READY_STATE = HttpStatus.OK;
//   } catch (error) {
//     AppConstant.APPLICATION_READY_STATE = HttpStatus.SERVICE_UNAVAILABLE;
//     const logger = new Logger('startMicroservice');
//     const { message, stack } = error;
//     logger.debug(`Start microservice transport error. Try to reconnect`);
//     logger.error(JSON.stringify({ message, stack }));
//   }
// }
// process.on('unhandledRejection', (reason, p) => {
//   Logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
// });
// process.on('uncaughtException', (err) => {
//   Logger.error(err, 'Uncaught Exception thrown');
// });
