import { Book } from "../database/models/book.model.js"

import express from "express"

const router = express.Router()

router.get("/:id", async (request, response) => {
    const { id } = request.params
    const filter = { id: id }

    const book = await Book.findOne(filter)

    response.json({
        "success": true,
        "views": book.views
    })
})

router.post("/:id/increment", async (request, response) => {
    const { id } = request.params
    const filter = { id: id }

    const oldBook = await Book.findOne(filter)

    const update = { views: oldBook.views + 1 }

    await Book.updateOne(filter, update)

    response.json({
        "success": true,
        "views": oldBook.views++
    })
})

export default router;