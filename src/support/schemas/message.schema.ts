import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ID } from "src/types";

export type MessageDocument = Message & Document

export class Message {

    _id?: ID;
    author: ID;

    sentAt: Date
    text: string
    readAt: Date
}

@Schema()
class SMessage {

    @Prop({ required: true })
    author: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    sentAt: Date

    @Prop({ required: true })
    text: string

    @Prop()
    readAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(SMessage)