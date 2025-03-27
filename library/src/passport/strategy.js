import LocalStrategy from "passport-local"
import { User } from "../database/models/users.model.js";
import crypto from "crypto"

export const LibraryStrategy = new LocalStrategy({ usernameField: "username", passowrdField: "password" },
    
    async function (username, password, callback) {
        const user = await User.findOne({ username: username })

        if (user == null) {
            callback(null, false)
         
            return;
        }

        crypto.pbkdf2(password, user.salt, 32000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return callback(err); }

            if (!crypto.timingSafeEqual(hashedPassword, user.hashed_password))
                return callback(null, false);

            return callback(null, user);
        });
    }
);