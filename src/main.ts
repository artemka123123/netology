import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, WsExceptionFilter } from './exception.filter';
import { MainInterceptor } from './interceptors/main.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter(), new WsExceptionFilter())
  app.useGlobalInterceptors(new MainInterceptor())

  app.use(cookieParser())

  app.setGlobalPrefix("api")

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
