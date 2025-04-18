import express from "express"
import { AdvertisementModel } from "../database/models/advertisement.model"
import { UserModel } from "../database/models/user.model"

import file from "../middleware/file.js"
import { AdvertisementModule } from "../modules/advertisement.js"
import { UserModule } from "../modules/users.js"

const router = express.Router()

router.get("/", async (request, response) => {

    const advertisements = await AdvertisementModel.find({});
    const result = {"data": []}

    for (let i = 0; i < advertisements.length; i++) {
        const advertisement = advertisements[i]
        const user = await UserModel.findOne({ _id: advertisement.userId })

        result.data.push({
            "id": advertisement._id,
            "shortTitle": advertisement.shortText,
            "description": advertisement.description,
            "images": advertisement.images || [],
            "user": {
                "id": advertisement.userId,
                "name": user.name
            },
            "createdAt": advertisement.createdAt
        })
    }

    response.json(result)

})

router.get("/:id", async (request, response) => {
    const { id } = request.params
    const advertisement = await AdvertisementModel.find({ _id: id })

    if (!advertisement) {
        return response.json({
            "error": "Объявление не найдено",
            "status": "error"
        })
    }

    response.json({
        "id": advertisement._id,
        "shortTitle": advertisement.shortText,
        "description": advertisement.description,
        "images": advertisement.images || [],
        "user": {
            "id": advertisement.userId,
            "name": user.name
        },
        "createdAt": advertisement.createdAt
    })

})

router.post("/", file.array("images"), async (request, response) => {
    const { shortTitle, description } = request.body
    const files = request.files

    if (!request.session.passport) {
        return response.status(401).json({
            "error": "Пользователь не аутентифицирован",
            "status": "error"
        })
    }

    const images = []
    for (let i = 0; i < files.length; i++)
        images.push(`public/${files[i].fieldname}`)

    const advertisement = await AdvertisementModule.create({
        shortText: shortTitle,
        description: description,
        images: images
    })

    const user = await UserModule.findByEmail(request.session.passport.use)

    response.json({
        "data": {
            "id": advertisement._id,
            "shortTitle": shortTitle,
            "description": description,
            images: images,
            "user": {
                "id": user._id,
                "name": user.name 
            },
            "createdAt": advertisement.createdAt
        },

        "status": "ok"
    })
})

router.delete("/:id", async (request, response) => {
    const { id } = request.params

    if (!request.session.passport) {
        return response.status(401).json({
            "error": "Пользователь не аутентифицирован",
            "status": "error"
        })
    }

    const advertisement = AdvertisementModel.findOne({ _id: id })

    if (!advertisement) {
        return response.json({
            "error": "Объявление не найдено",
            "status": "error"
        })
    }

    const user = await UserModel.findOne({ _id: advertisement.userId })

    if (request.session.passport.user != user.email) {
        return response.status(403).json({
            "error": "Вы не являетесь автором объявления",
            "status": "error"
        })
    }

    await AdvertisementModel.deleteOne({ _id: id })

})

export default router