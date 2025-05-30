var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import LocalStrategy from "passport-local";
import { User } from "../database/models/users.model.js";
import crypto from "crypto";
export const LibraryStrategy = new LocalStrategy({ usernameField: "username", passowrdField: "password" }, function (username, password, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ username: username });
        if (user == null) {
            callback(null, false);
            return;
        }
        crypto.pbkdf2(password, user.salt, 32000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return callback(err);
            }
            if (!crypto.timingSafeEqual(hashedPassword, user.hashed_password))
                return callback(null, false);
            return callback(null, user);
        });
    });
});
