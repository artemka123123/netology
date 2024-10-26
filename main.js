import express from "express"

const app = express()

import booksRouter from "./routes/api/books.js"
import userRouter from "./routes/api/user.js"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/books/", booksRouter)
app.use("/api/user", userRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT)