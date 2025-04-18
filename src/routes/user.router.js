import express from "express"
import { UserModule } from "../modules/users.js"
import crypto from "crypto"
import passport from "passport"

const router = express.Router()

router.post("/signup", async (request, response) => {
    const { email, password, name, contactPhone } = request.body

    if (await UserModule.findByEmail(email)) {

        return response.json({
            "error": "Email занят",
            "status": "error"
        })

    }

    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(password, salt, 32000, 32, "sha256", async (err, hashedPassword) => {
        if (err) return response.json({"error": "Ошибка при генерации хэша", "status": "error"})

        const user = await UserModule.create({ email: email, passwordHash: hashedPassword, name: name, contactPhone: contactPhone, salt: salt })

        return response.json({
            "data": {
                "id": user._id,
                "email": user.email,
                "name": user.name,
                "contactPhone": user.contactPhone
            },

            "status": "ok"
        })
    })
})

router.post("/signin", async (request, response) => {

    await passport.authenticate("local", (err, user) => {

        if (err || !user) response.json({
            "error": "Неверный логин или пароль",
            "status": "error"
        })

        return response.json({
            "data": {
                "id": user._id,
                "email": user.email,
                "name": user.name,
                "contactPhone": user.contactPhone
            },

            "status": "ok"
        })

    })(request, response)

});

export default router