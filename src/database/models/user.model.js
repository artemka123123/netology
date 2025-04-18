import { ObjectId } from "bson";
import { Schema, model } from "mongoose";

const User = new Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },

    passwordHash: {
        type: Buffer,
        unique: true,
        required: true
    },

    name: {
        type: String,
        unique: true,
        required: true
    },

    contactPhone: {
        type: String,
        unique: true,
        required: true
    },

    salt: {
        type: Buffer,
        unique: false,
        required: true
    }

})

export const UserModel = model("user", User)