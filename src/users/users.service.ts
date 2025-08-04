import { HttpException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Connection, Model } from "mongoose";
import { IUserService, SearchUserParams } from "./types/users.types";
import { ID } from "src/types";
import { firstValueFrom, from, skip, take } from "rxjs";

@Injectable()
export class UsersService implements IUserService {

    constructor(
        @InjectModel(User.name) private usersModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    async create(data: Partial<User>): Promise<User> {

        if (await this.usersModel.findOne({ email: data.email }))
            throw new HttpException("This email is already registered.", 400)

        return await this.usersModel.insertOne(data);
    }



    findById(id: ID): Promise<User> {
        return this.usersModel.findById(id)
    }

    findByEmail(email: string): Promise<User> {
        return this.usersModel.findOne({ email: email })
    }

    async findAll(params: SearchUserParams): Promise<User[]> {
        const userParams = {
            email: params.email || { $exists: true },
            contactPhone: params.contactPhone || { $exists: true },
            name: params.name || { $exists: true },
        }

        const users: Promise<UserDocument[]> = this.usersModel.find(userParams);

        const observable = from(users)
            .pipe(
                skip(params.offset),
                take(params.limit),
            )


        return firstValueFrom(observable)
    }
}