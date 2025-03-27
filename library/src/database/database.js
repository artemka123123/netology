import mongoose from "mongoose"

export async function connect(url) {

    try {

        await mongoose.connect(url, { dbName: "test" })

    } catch (err) { console.log(err) }

}