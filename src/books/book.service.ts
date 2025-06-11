import { Injectable } from '@nestjs/common';
import { CreateBook, UpdateBook } from './types/book';
import { randomUUID } from 'crypto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { Connection, HydratedDocument, Model, QueryWithHelpers } from 'mongoose';

@Injectable()
export class BookService {

    constructor(
        @InjectModel(Book.name) private BookModel: Model<BookDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    createBookId() {
        return randomUUID()
    }

    createBook(book: CreateBook): Promise<BookDocument> {
        const newBook = new this.BookModel(book);

        return newBook.save();
    }

    getAllBooks(): Promise<BookDocument[]> {

        return this.BookModel.find({})

    }

    getBook(id: string) : Promise<BookDocument> {
        return this.BookModel.findById(id)
    }

    updateBook(id: string, data: UpdateBook): QueryWithHelpers<HydratedDocument<BookDocument, unknown, unknown> | null, HydratedDocument<BookDocument, unknown, unknown>, unknown, BookDocument> {
        return this.BookModel.findOneAndUpdate({_id: id}, data)
    }

    removeBook(id: string): QueryWithHelpers<HydratedDocument<BookDocument, unknown, unknown> | null, HydratedDocument<BookDocument, unknown, unknown>, unknown, BookDocument> {

        return this.BookModel.findOneAndDelete({ _id: id })

    }
}
