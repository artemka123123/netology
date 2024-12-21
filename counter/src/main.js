import express from "express"

import error404 from "./middleware/errors/error404.js"
import counterRouter from "./routes/counter.router.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/counter/", counterRouter)

app.use(error404)

const PORT = process.env.PORT || 3000

app.listen(PORT)