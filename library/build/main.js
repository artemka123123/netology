var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from "./database/database.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import booksViewRouter from "./routes/view/book/book.router.js";
import indexViewRouter from "./routes/view/index.router.js";
import userViewRouter from "./routes/view/user/user.router.js";
import booksAPIRouter from "./routes/api/book/book.router.js";
import userAPIRouter from "./routes/api/user/user.router.js";
import session from "express-session";
import error404 from "./middleware/error.js";
import passport from "passport";
import { User } from "./database/models/users.model.js";
import { LibraryStrategy } from "./passport/strategy.js";
const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
connect(DB_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: true
}));
app.use("/books/", booksViewRouter);
app.use("/user/", userViewRouter);
app.use("/", indexViewRouter);
app.use("/user/api/", userAPIRouter);
app.use("/books/api/", booksAPIRouter);
app.use(error404);
passport.use(LibraryStrategy);
passport.deserializeUser((username, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ username: username });
    cb(null, user);
}));
passport.serializeUser((user, cb) => __awaiter(void 0, void 0, void 0, function* () {
    cb(null, user.username);
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
io.on("connection", (socket) => {
    const { book } = socket.handshake.query;
    const { id } = socket;
    socket.join(book);
    socket.on('comment', (msg) => {
        socket.emit("comment", msg);
        socket.to(book).emit("comment", msg);
    });
});
server.listen(PORT);
