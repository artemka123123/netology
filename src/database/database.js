import mongoose from "mongoose"

export function ConnectMongo(url) {

    mongoose.connect(url)

}