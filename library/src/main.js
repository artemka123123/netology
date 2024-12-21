import express from "express"
const app = express()

import booksViewRouter from "./routes/view/book/book.router.js"
import indexViewRouter from "./routes/view/index.router.js"

import booksAPIRouter from "./routes/api/book/book.router.js"
import userAPIRouter from "./routes/api/user/user.router.js"

import error404 from "./middleware/error.js"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");

app.use("/books/", booksViewRouter)
app.use("/", indexViewRouter)

app.use("/user/api/", userAPIRouter)
app.use("/books/api/", booksAPIRouter)

app.use(error404)

const PORT = process.env.PORT || 3000

app.listen(PORT)