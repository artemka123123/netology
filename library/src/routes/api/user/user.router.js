import express from "express"
import { User } from "../../../database/models/users.model.js"

import passport from "passport"
import crypto from "crypto"

const router = express.Router()

router.post("/login", passport.authenticate('local', {
        successRedirect: "/user/me",
        failureRedirect: "/user/login"
    })
)

router.post("/signup", async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username: username })

    if (user) {
        response.redirect(`/user/signup`)
        
        return;
    }

    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 32000, 32, 'sha256', async (err, hashed) => {
        if (err) return;

        await User.insertOne({username: username, hashed_password: hashed, salt: salt})
    })

    response.redirect(`/user/login`)
})

export default router