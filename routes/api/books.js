import express from "express"
import { v4 as uuid } from "uuid"
import path from "path"

import storage from "../../storage/storage.js"
import { Book } from "../../storage/storage.js"
import file from "../../middleware/file.js"

const router = express.Router()

router.get("/", (request, response) => {

    response.json(storage.books)

})

router.get("/:id", (request, response) => {
    const { id } = request.params
    const book = storage.books.find(b => b.id == id)

    if (!book) {
        response.status(404)
        response.json({
            suceess: false,
            error: "Книга не найдена."
        })

        return
    } 

    response.json({
        sucess: true,
        book: book
    })
})

router.post("/", file.single("fileBook"), (request, response) => {
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    if (!request.file) {
        response.status(400)

        response.json({
            success: false,
            error: "У книги должен быть файл."
        })

        return
    }

    if (!title) {
        response.status(400)
    
        response.json({
            success: false,
            error: "У книги должно быть название."
        })

        return
    }

    const newBook = new Book(uuid(), title, description, authors, favorite, fileCover, fileName, request.file.path)
    storage.books.push(newBook)

    response.status(201)
    
    response.json({
        success: true,
        book: newBook
    })
})

router.put("/:id", file.single("fileBook"), (request, response) => {
    const { id } = request.params
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    const index = storage.books.findIndex(b => b.id == id)

    if (index == -1) {
        response.status(404);

        response.json({
            suceess: false,
            error: "Книга не найдена."
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
        request.file.path || oldBook.fileBook
    )

    response.status(201)

    response.json({
        sucess: true,
        book: storage.books[index]
    })
})

router.delete("/:id", (request, response) => {
    const { id } = request.params
    const index = storage.books.findIndex(b => b.id == id)

    if (index == -1) {
        response.status(404)

        response.json({
            suceess: false,
            error: "Книга не найдена."
        })

        return
    }

    const removedBook = storage.books.splice(index, 1)[0]

    response.status(201)
    
    response.json({
        success: true,
        book: removedBook
    })
})

router.get("/:id/download", (request, response) => {
    const { id } = request.params
    const index = storage.books.findIndex(b => b.id == id)

    if (index == -1) {
        response.status(404)

        response.json({
            suceess: false,
            error: "Книга не найдена."
        })

        return
    }

    const book = storage.books[index]

    response.sendFile(path.resolve(book.fileBook), {})
})

export default router