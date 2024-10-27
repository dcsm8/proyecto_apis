import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { BusinessErrorsInterceptor } from './shared/interceptors/business-errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  app.useGlobalInterceptors(new BusinessErrorsInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
