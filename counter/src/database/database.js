import mongoose from "mongoose"

export async function connect(url) {

    try {

        mongoose.connect(url)

    } catch (err) { console.log(err) }

}