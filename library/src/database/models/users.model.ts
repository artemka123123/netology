import { Schema, model } from "mongoose"

const UserSchema = new Schema({

    username: {
        type: String
    },

    hashed_password: {
        type: Buffer
    },

    salt: {
        type: Buffer
    }

})

export const User = model("User", UserSchema)