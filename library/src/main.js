import { connect } from "./database/database.js"

import express from "express"
const app = express()

import booksViewRouter from "./routes/view/book/book.router.js"
import indexViewRouter from "./routes/view/index.router.js"
import userViewRouter from "./routes/view/user/user.router.js"

import booksAPIRouter from "./routes/api/book/book.router.js"
import userAPIRouter from "./routes/api/user/user.router.js"

import session from "express-session"
import error404 from "./middleware/error.js"
import passport from "passport"
import { User } from "./database/models/users.model.js"
import { LibraryStrategy } from "./passport/strategy.js"

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL

connect(DB_URL)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");

app.use(session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: true
}))

app.use("/books/", booksViewRouter)
app.use("/user/", userViewRouter)
app.use("/", indexViewRouter)

app.use("/user/api/", userAPIRouter)
app.use("/books/api/", booksAPIRouter)

app.use(error404)

passport.use(LibraryStrategy)

passport.deserializeUser(async (username, cb) => {
    const user = await User.findOne({username: username})

    cb(null, user);
})

passport.serializeUser(async (user, cb) => {
    cb(null, user.username)
})

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'));

app.listen(PORT)