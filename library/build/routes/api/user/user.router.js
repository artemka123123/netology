var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { User } from "../../../database/models/users.model.js";
import passport from "passport";
import crypto from "crypto";
const router = express.Router();
router.post("/login", passport.authenticate('local', {
    successRedirect: "/user/me",
    failureRedirect: "/user/login"
}));
router.post("/signup", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    const user = yield User.findOne({ username: username });
    if (user) {
        response.redirect(`/user/signup`);
        return;
    }
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 32000, 32, 'sha256', (err, hashed) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return;
        yield User.insertOne({ username: username, hashed_password: hashed, salt: salt });
    }));
    response.redirect(`/user/login`);
}));
export default router;
