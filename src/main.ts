import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  BaseExceptionFilter,
  HttpExceptionFilter,
  TypeORMExceptionFilter,
} from '@utils/exception';
import { CustomValidationPipe } from '@utils/pipe/ValidationPipe';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const logger = new Logger();
  app.useGlobalFilters(
    new BaseExceptionFilter(logger),
    new HttpExceptionFilter(logger),
    new TypeORMExceptionFilter(logger),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
