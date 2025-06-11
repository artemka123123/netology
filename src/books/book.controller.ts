import { Controller, Delete, Get, Param, ParseArrayPipe, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBook } from './types/book';


@Controller("books")
export class BookController {
  constructor(private readonly bookService: BookService) {}



  @Post("create/")
  createBook(
    @Query("title") title: string, 
    @Query("description") description: string,
    @Query("authors", new ParseArrayPipe({ items: String, separator: "," })) authors: string[],
    @Query("fileCover") fileCover: string,
    @Query("fileBook") fileBook: string

  ) {

    const createBook: CreateBook = {
      title: title,
      description: description,
      authors: authors,
      fileCover: fileCover,
      fileBook: fileBook
    }

    return this.bookService.createBook(createBook);
  }

  @Get(":id/")
  getBook(@Param("id") id: string) {

    return this.bookService.getBook(id)

  }

  @Get()
  getBooks() {

    return this.bookService.getAllBooks();

  }

  @Delete(":id/")
  removeBook(@Param("id") id: string) {

    return this.bookService.removeBook(id)

  }
}
