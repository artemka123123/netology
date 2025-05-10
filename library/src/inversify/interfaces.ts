export interface Book {

    id: number,
    title: string,
    description: string,

    authors: string[],
    favorite: string,

    fileCover: string,
    fileName: string,
    
    views: number
}

export abstract class BookRepository {

    abstract createBook(book: Book): void;

    abstract getBook(id: number): Book | null;
    abstract getBooks(): Book[];

    abstract updateBook(id: number, book: Book): void;
    abstract deleteBook(id: number): void;

}