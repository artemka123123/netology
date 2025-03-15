import mongoose from "mongoose"

export async function connect(url) {

    try {

            console.log(url)

        await mongoose.connect(url, { dbName: "test" })

    } catch (err) { console.log(err) }

}