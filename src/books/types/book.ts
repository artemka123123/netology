
export interface CreateBook {

    title: string;
    description: string;
    authors: string[];

    fileCover: string;
    fileBook: string;
}

export interface GetBook {

    success: boolean
    error: string

    book: Book

}

export interface RemoveBook {

    success: boolean,
    error: string,

    book: Book

}

export interface Book {

    id: string;

    title: string;
    description: string;
    authors: string[];

    favorite: string[]

    fileCover: string;
    fileBook: string;

    views: number;

}