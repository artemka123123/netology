import express from "express"
import path from "path"

import storage from "../../../storage/storage.js"

const router = express.Router()

router.get("/", (request, response) => {

    response.render("books/index", {
        title: "Книги",
        books: storage.books
    })

})

router.get("/create", (reqeust, response) => {
    response.render("books/create", {
        title: "Создать книгу"
    })
})

router.get("/view/:id", (request, response) => {
    const { id } = request.params
    const book = storage.books.find(b => b.id == id)

    if (!book) {
        response.render("errors/404")

        return
    } 

    response.render("books/view", {
        title: book.title,
        book: book
    })
})

router.get("/edit/:id", (request, response) => {
    const { id } = request.params

    const book = storage.books.find(b => b.id == id)

    if (book == undefined) {
        response.render("errors/404", {
            title: "Книга не найдена!"
        })

        return
    }

    response.render("books/edit", {
        title: "Изменить книгу",
        book: book
    })
})

export default router