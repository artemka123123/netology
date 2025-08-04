import { Injectable } from "@nestjs/common";
import { CreateSupportRequestDto, ISupportRequestClientService, MarkMessagesAsReadDto } from "./types/support.types";
import { ID } from "src/types";
import { SupportRequest, SupportRequestDocument } from "./schemas/request.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./schemas/message.schema";
import mongoose, { Connection, Model, mongo } from "mongoose";
import { count, distinct, filter, firstValueFrom, from, map, mergeAll, toArray } from "rxjs";
import { User, UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {

    constructor(
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,

        @InjectModel(User.name) private userModel: Model<UserDocument>,

        @InjectConnection() private connection: Connection
    ) {}

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {

        const date = new Date();

        const messageId = new mongoose.Types.ObjectId();

        const messages: Message[] = [{
            author: data.user,
            sentAt: date,
            text: data.text,
            readAt: null
        }]

        const request: SupportRequest = {
            author: data.user,
            sentAt: date,
            messages: messages,
            isActive: true
        }

        return await this.supportRequestModel.insertOne(request)
    }
    
    async markMessagesAsRead(params: MarkMessagesAsReadDto) {
        
        const date = new Date();

        const request: SupportRequestDocument = await this.supportRequestModel.findOne({ _id: params.supportRequest })

        const observable = from(request.messages)
            .pipe(
                filter((msg) => msg.sentAt <= date),
                filter((msg) => msg.author != params.user),

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
                filter((msg) => getUser(msg.author).role != "client"),
                filter(msg => msg.readAt == null),
                count()
            )

        return firstValueFrom(observableMessages)
    }
}