import express from "express"
const app = express()

import booksRouter from "./routes/books.js"
import indexRouter from "./routes/index.js"

import error404 from "./middleware/error.js"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");

app.use("/", indexRouter)
app.use("/books/", booksRouter)

app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT)