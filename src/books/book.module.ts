import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { CommentService } from './comments/comment.service';
import { CommentsModule } from './comments/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema }
    ]),

    CommentsModule
  ],

  controllers: [BookController],
  providers: [BookService],
  exports: [BookService, CommentService]
})
export class BookModule {



}
