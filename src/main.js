import { ConnectMongo } from "./database/database.js"

import express from "express"
import { createServer } from "noed:http"
import { Server } from "socket.io"

import session, { Cookie } from "express-session"
import passport from "passport"
import strategy from "./passport/strategy.js"
import { UserModule } from "./modules/users.js"

import UserRouter from "./routes/user.router.js"
import AdvertisementRouter from "./routes/advertisments.js"
import { ChatModule } from "./modules/chat.js"
import { ChatModel, Message } from "./database/models/chat.model.js"

const app = express()
const server = createServer(app)
const io = new Server(server)

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

ConnectMongo(MONGO_URL)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionMiddleware = session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: true,    
})

io.engine.use(sessionMiddleware)
app.use(sessionMiddleware)

app.use(express.cookieParser())

passport.use(strategy)

passport.deserializeUser(async (email, cb) => {
    const user = UserModule.findByEmail(email);

    cb(null, user)
})

passport.serializeUser(async (user, cb) => {
    cb(null, user.email)
})

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate("session"))

app.use("/api", UserRouter)
app.use("/api/advertisements", AdvertisementRouter)

io.on("connection", async (socket) => {
    const request = socket.request

    if (!request.session) return;
    if (!request.session.passport) return;

    const email = request.session.passport.email
    const user = await UserModule.findByEmail(email)

    const chats = await ChatModel.find({ users: user._id })
    for (let i = 0; i < chats.length; i++) {
        const chat = chats[i]
        
        ChatModule.subscribe((data) => {

            socket.emit("newMessage", data.message)

        }, chat._id)
    
    }

    socket.on("getHistory", async (id) => {
        const chat = await ChatModule.find([ id, user._id ])
        
        socket.emit("chatHistory", chat.messages)
    })

    socket.on("sendMessage", async (receiver, text) => {

        await ChatModule.sendMessages({ author: user._id, receiver: receiver, text: text })
    })

})

server.listen(3000)