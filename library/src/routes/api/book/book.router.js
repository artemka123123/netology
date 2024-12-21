import express from "express"
import { v4 as uuid } from "uuid"
import path from "path"

import { getStorage, addBook, Book, chanageStorage } from "../../../storage/storage.js"
import file from "../../../middleware/file.js"

import req from "request"

const router = express.Router()

router.post("/create", file.single("fileBook"), (request, response) => {
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

    const newBook = new Book(uuid(), title, description, authors, favorite, fileCover, fileName, path.basename(request.file.path))
    addBook(newBook)

    response.redirect("/books/")
})

router.post("/edit/:id", (request, response) => {
    const { id } = request.params
    const { title, description, authors, favorite, fileCover, fileName } = request.body
    
    const storage = getStorage()

    const filePath = ""
    if (request.file) filePath = request.file.path

    const index = storage.books.findIndex(b => b.id == id)


    if (index == -1) {
        response.render("errors/404", {
            title: "Книга не найдена!"
        })

        return
    }

    const oldBook = storage.books[index]

    storage.books[index] = new Book(
        oldBook.id,
        title || oldBook.title,
        description || oldBook.description,
        authors || oldBook.authors,
        favorite || oldBook.favorite,
        fileCover || oldBook.fileCover,
        fileName || oldBook.fileName,
        filePath || oldBook.fileBook
    )

    chanageStorage(storage)

    response.redirect("/books/")
})

router.post("/delete/:id", (request, response) => {
    const storage = getStorage()

    const { id } = request.params
    const index = storage.books.findIndex(b => b.id == id)

    if (index == -1) {
        response.render("errors/404", {
            title: "Книга не"
        })

        return
    }

    storage.books.splice(index, 1)[0]
    
    response.redirect("/books/")
})

router.get("/download/:id", (request, response) => {
    const { id } = request.params
    const index = storage.books.findIndex(b => b.id == id)

    const storage = getStorage()

    if (index == -1) {
        response.render("errors/404", {
            title: "Книга не найдена!"
        })

        return
    }

    const book = storage.books[index]

    response.sendFile(path.resolve("public/books/", book.fileBook))
})

export default router