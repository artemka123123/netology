import { Module } from '@nestjs/common';
import { BookModule } from './books/book.module';
import { AppController } from './app.controller';

@Module({
  imports: [BookModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {



}
