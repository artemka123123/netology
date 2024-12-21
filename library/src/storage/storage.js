import { v4 as uuid } from "uuid"
import fs from "node:fs"

const BOOKS_DATA = "/data/books/books.dat"

export class Book {

    constructor(id, title, description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "", views = 0) {
        this.id = id

        this.title = title
        this.description = description
        this.authors = authors

        this.favorite = favorite

        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
        this.views = views
    }
}

export function getStorage() {
    
    if (!fs.existsSync(BOOKS_DATA)) {
        fs.writeFileSync(BOOKS_DATA, "{\"books\": []}")
    }

    return JSON.parse(fs.readFileSync(BOOKS_DATA))
}

export function addBook(book) {
    const storage = getStorage()

    storage.books.push(book)

    fs.writeFileSync(BOOKS_DATA, JSON.stringify(storage))
}

export function chanageStorage(storage) {
    fs.writeFileSync(BOOKS_DATA, JSON.stringify(storage))
}