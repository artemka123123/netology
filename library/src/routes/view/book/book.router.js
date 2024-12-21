import express from "express"
import req from "request"

import { getStorage } from "../../../storage/storage.js"

const router = express.Router()

router.get("/", (request, response) => {

    const storage = getStorage()

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
    const storage = getStorage()

    const { id } = request.params
    const book = storage.books.find(b => b.id == id)

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

router.get("/edit/:id", (request, response) => {
    const storage = getStorage()

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