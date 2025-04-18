import { UserModel } from "../database/models/user.model.js"

export class UserModule {


    static async create(data) {
        const { email, passwordHash, name, contactPhone, salt } = data

        return await UserModel.insertOne(
            {
                email: email,
                passwordHash: passwordHash, 
                name: name, 
                contactPhone: contactPhone,
                salt: salt
            }
        )
    }

    static async findByEmail(email) {
        
        return await UserModel.findOne({
            email: email
        })
    }
}