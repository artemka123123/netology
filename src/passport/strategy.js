import LocalStrategy from "passport-local"
import { UserModule } from "../modules/users.js"
import crypto from "crypto"

export default new LocalStrategy({ usernameField: "email", passwordField: "password" },


    async function (username, password, callback) {
        const user = await UserModule.findByEmail(username)

        if (!user) return callback(null, false)

        crypto.pbkdf2(password, user.salt, 32000, 32, "sha256", (err, hashedPassword) => {
            if (err) callback(err);

            console.log(user)

            if (!crypto.timingSafeEqual(hashedPassword, user.passwordHash))
                return callback(null, false)

            return callback(null, user)
        })

    }

)