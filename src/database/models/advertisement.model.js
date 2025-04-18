import { ObjectId } from "bson";
import { model, Schema } from "mongoose";


const Advertisement = new Schema({

    shortText: {
        type: String,
        unique: false,
        required: true
    },

    description: {
        type: String,
        unique: false,
        required: false
    },

    images: {
        type: [String],
        unique: false,
        required: false
    },

    userId: {
        type: ObjectId,
        unique: false,
        required: true
    },

    createdAt: {
        type: Date,
        unqiue: false,
        required: true
    },

    updatedAt: {
        type: Date,
        unique: false,
        required: true
    },

    tags: {
        type: [String],
        unique: false,
        required: false
    },

    isDeleted: {
        type: Boolean,
        unique: false,
        reqired: true,
    }
})

export const AdvertisementModel = model("advertisement", Advertisement)