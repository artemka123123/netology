import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception.filter';
import { MainInterceptor } from './interceptors/main.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new MainInterceptor())

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
