import express from "express"
import req from "request"

import { Book } from "../../../database/models/book.model.js"

const router = express.Router()

router.get("/", async (request, response) => {

    const books = await Book.find({})

    response.render("books/index", {
        title: "Книги",
        books: books
    })
})

router.get("/create", (reqeust, response) => {
    response.render("books/create", {
        title: "Создать книгу"
    })
})

router.get("/view/:id", async (request, response) => {
    const { id } = request.params
    const filter = { id: id }

    const book = await Book.findOne(filter)

    if (!book) {
        response.render("errors/404")

        return
    }

    req.post(`http://172.18.0.1:3001/counter/${id}/increment`);
    
    req(`http://172.18.0.1:3001/counter/${id}`, (err, res, body) => {
        const data = JSON.parse(body)

        response.render("books/view", {
            title: book.title,
            book: book,
            views: data.views
        })
    })
})

router.get("/edit/:id", async (request, response) => {
    const { id } = request.params
    const filter = { id: id }

    const book = await Book.findOne(filter)

    if (!book) {
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