import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Book, BookDocument, BookSchema } from './schemas/book.schema';
import { ConfigModule } from '@nestjs/config';
import { CreateBook } from './types/book';

describe('AppController', () => {
  let bookController: BookController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      imports: [
        MongooseModule.forFeature([
        {
          name: Book.name,
          schema: BookSchema
        }
        ]),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URL),
      ],

      providers: [ BookService, {provide: getModelToken(Book.name), useValue: BookSchema}],
    }).compile();

    bookController = app.get<BookController>(BookController);
  });

  describe('root', () => {

    const data: CreateBook = {
      title: "Test title",

      description: "Test description",
      authors: ["Test author 1", "Test author 2"],

      fileCover: "books.com/test_cover.png",
      fileBook: "books.com/test_book.dat"
    };

    let document: BookDocument;

    it("createBook(data)", async () => {
      document = await bookController.createBook(data)
    
      expect(document.title == data.title).toBeTruthy()
    
      expect(document.description == data.description).toBeTruthy()
      expect(document.authors == data.authors).toBeTruthy()

      expect(document.fileCover == data.fileCover).toBeTruthy()
      expect(document.fileBook == data.fileBook).toBeTruthy()
    })

    it("getBook(id)", async () => {
      const gotBook = await bookController.getBook(document.id);

      expect(gotBook.title == data.title).toBeTruthy()
    
      expect(gotBook.description == data.description).toBeTruthy()
      expect(gotBook.authors == data.authors).toBeTruthy()

      expect(gotBook.fileCover == data.fileCover).toBeTruthy()
      expect(gotBook.fileBook == data.fileBook).toBeTruthy()

    })

    it("removeBook(id)", async () => {
      const removedBook = await bookController.removeBook(document.id)

      expect(removedBook != undefined).toBeTruthy()
    })

  });
});
