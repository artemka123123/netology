import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GetChatListParams, ISupportRequestService, SendMessageDto } from "./types/support.types";
import { ID } from "src/types";
import { Message, MessageDocument } from "./schemas/message.schema";
import { SupportRequest, SupportRequestDocument } from "./schemas/request.schema";
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { EventEmitter } from "events";

@Injectable()
export class SupportRequestService implements ISupportRequestService {

    constructor(
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,

        @InjectConnection() private connection: Connection
    ) {

    }

    private events: EventEmitter = new EventEmitter();

    async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
        const searchParams = {
            user: params.user || {},
            isActive: params.isActive
        }
        
        return this.supportRequestModel.find(searchParams)
    }
    
    private async getSupportRequest(id: ID): Promise<SupportRequestDocument> {
        const supportRequest: SupportRequestDocument = await this.supportRequestModel.findOne({_id: id})

        if (!supportRequest)
            throw new HttpException("Support request not found.", HttpStatus.NOT_FOUND);
    
        return supportRequest;
    }

    async sendMessage(data: SendMessageDto): Promise<Message> {
        const date = new Date()
        
        const message: Message = {
            author: data.author,
            sentAt: date,

            text: data.text,
            readAt: undefined
        }

        const supportRequest = await this.getSupportRequest(data.supportRequest);

        supportRequest.messages.push(message)
        supportRequest.save()

        this.events.emit("message", supportRequest, message);

        return message
    }
    
    async getMessages(id: ID): Promise<Message[]> {
        
        const supportRequest = await this.getSupportRequest(id);

        return supportRequest.messages;
    }
    
    subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
        return () => {
            this.events.on("message", (request: SupportRequest, message: Message) => handler(request, message));
        };
    }
}