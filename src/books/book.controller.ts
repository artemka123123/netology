import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBook, UpdateBook } from './types/book';
import { BookDocument } from './schemas/book.schema';


@Controller("books")
export class BookController {
  constructor(private readonly bookService: BookService) {}



  @Post("create/")
  createBook(
    @Body() body: CreateBook): Promise<BookDocument> {

    return this.bookService.createBook(body);
  }

  @Get(":id/")
  getBook(@Param("id") id: string) {

    return this.bookService.getBook(id)

  }

  @Get()
  getBooks() {

    return this.bookService.getAllBooks();

  }

  @Put(":id/")
  updateBook(@Param("id") id: string, @Body() body: UpdateBook) {

    return this.bookService.updateBook(id, body)

  }

  @Delete(":id/")
  removeBook(@Param("id") id: string) {

    return this.bookService.removeBook(id)

  }
}
