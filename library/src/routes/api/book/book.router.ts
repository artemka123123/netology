
import express from "express"
import path from "path"

import file from "../../../middleware/file.js"
import fs from "node:fs"
import { container } from "../../../inversify/inversify.config.js"
import { Book } from "../../../database/models/book.model.js"
import { BookRepository } from "../../../inversify/interfaces.js"

const router = express.Router()

router.post("/create", file.single("fileBook"), async (request, response) => {
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    if (!request.file) {
        response.render("errors/400", {
            title: "У книги должен быть файл!"
        })

        return
    }

    if (!title) {
        response.render("errors/400", {
            title: "У книги должно быть название!"
        })

        return
    }

    const newBook = {
        title: title,
        description: description,
        authors: authors,
        favorite: favorite,
        fileCover: fileCover,
        fileName: fileName
    }

    container.get(BookRepository).createBook(newBook)

    response.redirect("/books/")
})

router.post("/edit/:id", async (request, response) => {
    const { id } = request.params
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    var filePath = ""
    if (request.file) filePath = request.file.path

    const oldBook = container.get(BookRepository).getBook(id)

    if (!oldBook) {
        response.render("errors/404", {
            title: "Книга не найдена!"
        })

        return
    }

    const update = {
        $set: {
            title: title || oldBook.title,
            description: description || oldBook.description,
            authors: authors || oldBook.authors,
            favorite: favorite || oldBook.favorite,
            fileCover: fileCover || oldBook.fileCover,
            fileName: fileName || oldBook.fileName
        }
    }

    await Book.updateOne({ "id": id }, update)

    response.redirect("/books/")
})

router.post("/delete/:id", async (request, response) => {
    const { id } = request.params

    container.get(BookRepository).deleteBook(id)
    
    response.redirect("/books/")
})

router.get("/download/:id", async (request, response) => {
    const { id } = request.params

    const book = container.get(BookRepository).getBook(id)

    if (!book) {
        response.render("errors/404", {
            title: "Книга не найдена!"
        })

        return
    }

    response.send(fs.readFileSync(path.resolve("/data/books/", `${book.fileName}.book`)))
})

export default router