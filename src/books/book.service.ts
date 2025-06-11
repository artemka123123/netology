import { Injectable } from '@nestjs/common';
import { Book, CreateBook, GetBook, RemoveBook } from './types/book';
import { randomUUID } from 'crypto';

@Injectable()
export class BookService {

    books: Book[] = [
        {
            id: "1234",

            title: "Война и мир",
            description: "Описание",
            authors: ["Лев толстой"],

            favorite: [],

            fileCover: "",
            fileBook: "",

            views: 0
        }
    ];

    createBookId() {
        return randomUUID()
    }

    createBook(book: CreateBook) : GetBook {

        const newBook: Book = {

            id: this.createBookId(),

            title: book.title,
            description: book.description,
            authors: book.authors,

            favorite: [],

            fileCover: book.fileCover,
            fileBook: book.fileBook,

            views: 0
        };

        this.books.push(newBook);

        return this.getBook(newBook.id)
    }

    getAllBooks() {

        return this.books;

    }

    getBook(id: string) : GetBook {
        const book = this.books.find((b) => b.id == id);
    
        if (!book) {

            return {
                success: false,
                error: "Book with this ID not found.",

                book: null
            }

        }

        return {
            success: true,
            error: null,

            book: book
        }
    }

    removeBook(id: string): RemoveBook {

        const index = this.books.findIndex((b) => b.id == id);

        if (index == -1) {

            return {
                success: false,
                error: "Book with this ID not found.",

                book: null
            }

        }

        const book = this.books.splice(index, 1)[0];
        
        return {
            success: true,
            error: null,

            book: book
        }
    }
}
