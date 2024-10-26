import { v4 as uuid } from "uuid"

export class Book {

    constructor(id, title, description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "") {
        this.id = id

        this.title = title
        this.description = description
        this.authors = authors

        this.favorite = favorite

        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const storage = {
    books: [
        new Book(
            uuid(),

            "Война и мир",
        )
    ]
}

export default storage