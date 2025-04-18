import { AdvertisementModel } from "../database/models/advertisement.model"


export class AdvertisementModule {

    static async find(params) {
        const { shortText, description, userId, tags } = params


        return await AdvertisementModel.findOne({
            shortText: {
                $regex: shortText
            },

            description: {
                $regex: description
            },

            userId: userId,

            tags: tags
        })
    }

    static async create(data) {
        const { shortText, description, images, userId, createdAt, updatedAt, tags, isDeleted } = data

        return await AdvertisementModel.insertOne({
            shortText: shortText,
            description: description,
            images: images,
            userId: userId,
            createdAt: createdAt,
            updatedAt: updatedAt,
            tags: tags,
            isDeleted: isDeleted
        })
    }

    static async remove(id) {

        return await AdvertisementModel.updateOne( {_id: id }, { isDeleted: true })

    }
}