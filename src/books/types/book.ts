
export interface CreateBook {

    title: string;
    description: string;
    authors: string[];

    fileCover: string;
    fileBook: string;
}

export interface UpdateBook {

    title: string;
    description: string;
    authors: string[];

    fileCover: string;
    fileBook: string;
    
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