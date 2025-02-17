import { Book } from "../../../database/models/book.model.js"

import express from "express"
import path from "path"

import { randomUUID } from "crypto"

import file from "../../../middleware/file.js"
import fs from "node:fs"

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

    const newBook = new Book({
        id: randomUUID(),
        title: title,
        description: description,
        authors: authors,
        favorite: favorite,
        fileCover: fileCover,
        fileName: title,
        views: 0
    })

    await newBook.save()

    response.redirect("/books/")
})

router.post("/edit/:id", async (request, response) => {
    const { id } = request.params
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    const filePath = ""
    if (request.file) filePath = request.file.path

    const filter = {id: id}

    const oldBook = await Book.findOne(filter)

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

    const filter = { id: id }

    await Book.deleteOne(filter)
    
    response.redirect("/books/")
})

router.get("/download/:id", async (request, response) => {
    const { id } = request.params
    const filter = { id: id} 

    const book = await Book.findOne(filter)

    if (!book) {
        response.render("errors/404", {
            title: "Книга не найдена!"
        })

        return
    }

    response.send(fs.readFileSync(path.resolve("/data/books/", `${book.fileName}.book`)))
})

export default router