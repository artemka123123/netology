import express from "express"
import req from "request"

import { Book } from "../../../database/models/book.model.js"
import { container } from "../../../inversify/inversify.config.js"
import { BookRepository } from "../../../inversify/interfaces.js"

const router = express.Router()

const getUserParams = (request) => {

    return {
        "loggedIn": request.session.passport != null,
        "user": request.session.passport
    }

}

router.get("/", async (request, response) => {
    const { loggedIn, user } = getUserParams(request)

    const books = container.get(BookRepository).getBooks()

    response.render("books/index", {
        title: "Книги",
        books: books,
        loggedIn: loggedIn,
        user: user
    })
})

router.get("/create", (request, response) => {
    const { loggedIn, user } = getUserParams(request)

    if (!loggedIn)
        return response.render("errors/404", { loggedIn: loggedIn })

    response.render("books/create", {
        title: "Создать книгу",
        loggedIn: loggedIn,
        user: user
    })
})

router.get("/view/:id", async (request, response) => {
    const { loggedIn, user } = getUserParams(request)
    
    const { id } = request.params

    const book = container.get(BookRepository).getBook(id)

    if (!book) {
        return response.render("errors/404", { loggedIn: loggedIn })
    }

    req.post(`http://172.18.0.1:3001/counter/${id}/increment`);
    
    req(`http://172.18.0.1:3001/counter/${id}`, (err, res, body) => {
        const data = JSON.parse(body)

        response.render("books/view", {
            title: book.title,
            book: book,
            views: data.views,
            loggedIn: loggedIn,
            user: user
        })
    })
})

router.get("/edit/:id", async (request, response) => {
    const { loggedIn, user } = getUserParams(request)

    if (!loggedIn)
        return response.render("errors/404", { loggedIn: loggedIn })

    const { id } = request.params
    const book = container.get(BookRepository).getBook(id)

    if (!book) {
        response.render("errors/404", {
            title: "Книга не найдена!",
            loggedIn: loggedIn,
            user: user
        })

        return
    }

    response.render("books/edit", {
        title: "Изменить книгу",
        book: book,
        loggedIn: loggedIn,
        user: user
    })
})

export default router