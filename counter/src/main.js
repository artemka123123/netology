import express from "express"

import error404 from "./middleware/errors/error404.js"
import counterRouter from "./routes/counter.router.js"

import { connect } from "./database/database.js"

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL

connect(DB_URL)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/counter/", counterRouter)

app.use(error404)

app.listen(PORT)