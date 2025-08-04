import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { SupportRequest, SupportRequestDocument } from "./schemas/request.schema";
import { Message, MessageDocument } from "./schemas/message.schema";
import { Connection, Model } from "mongoose";
import { ISupportRequestEmployeeService, MarkMessagesAsReadDto } from "./types/support.types";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { ID } from "src/types";
import { count, distinct, filter, firstValueFrom, from, map, mergeAll, toArray } from "rxjs";

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {

    constructor(
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,

        @InjectModel(User.name) private userModel: Model<UserDocument>,

        @InjectConnection() private connection: Connection
    ) {}
    
    async markMessagesAsRead(params: MarkMessagesAsReadDto) {
        
        const date = new Date();

        const request: SupportRequestDocument = await this.supportRequestModel.findOne({ _id: params.supportRequest })

        const observable = from(request.messages)
            .pipe(
                filter((msg) => msg.sentAt <= date),
                filter((msg) => msg.author == params.user),

                map((msg) => {
                    msg.readAt = date;

                    return msg;
                }),
                
                toArray()
            )

        const messages = await firstValueFrom(observable)

        request.messages = messages;
        request.save()

    }

    private async getUser(userId: ID): Promise<UserDocument> {
        return await this.userModel.findOne({_id: userId})
    }

    async getUnreadCount(supportRequest: ID): Promise<number> {
        
        const request: SupportRequestDocument = await this.supportRequestModel.findOne({ _id: supportRequest })
        
        const observableUsers = from(request.messages)
            .pipe(
                map((msg) => msg.author),
                distinct(),
                map((author) => this.getUser(author)),
                mergeAll(),
                toArray()
            )

        const users = await firstValueFrom(observableUsers);
        const getUser = (id: ID): UserDocument => {
            return users.find((u) => u._id == id)
        }

        const observableMessages = from(request.messages)
            .pipe(
                filter((msg) => getUser(msg.author).role == "client"),
                filter(msg => msg.readAt == null),
                count()
            )

        return firstValueFrom(observableMessages)
    }

    async closeRequest(supportRequest: ID): Promise<void> {
        
        await this.supportRequestModel.updateOne({_id: supportRequest}, { isActive: false })

    }
}
