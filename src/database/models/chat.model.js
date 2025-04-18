import { model, Schema } from "mongoose";
import { ObjectId } from "bson";

const Chat = new Schema({

    users: {
        type: [ObjectId, ObjectId],
        unique: false,
        requried: true
    },

    createdAt: {
        type: Date,
        unique: false,
        required: true
    },

    messages: {
        type: [Message],
        unqiue: false,
        required: false
    }

})

export const Message = new Schema({

    _id: {
        type: ObjectId,
        unique: true,
        required: true
    },

    author: {
        type: ObjectId,
        unqiue: false,
        required: true
    },

    sentAt: {
        type: Date,
        unqiue: false,
        required: true
    },

    text: {
        type: String,
        unique: false,
        required: true
    },

    readAt: {
        type: Date,
        unique: false,
        required: false
    }

})

export const ChatModel = model("chat", Chat)