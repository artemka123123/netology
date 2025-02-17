import { Schema, model } from "mongoose"

const BookSchema = new Schema({
        id: {
            type: String
        },

        title: {
            type: String
        },
        description: {
            type: String
        },
        
        authors: {
            type: String,
            default: "[]"
        },
        favorite: {
            type: String
        },

        fileCover: {
            type: String
        },
        fileName: {
            type: String
        },

        views: {
            type: Number,
            default: 0
        }
})

export const Book = model("Book", BookSchema)