import { Module } from '@nestjs/common';
import { BookModule } from './books/book.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),

    BookModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {



}
