import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";
import { Message } from "./message.schema";
import { ID } from "src/types";

export type SupportRequestDocument = SupportRequest & Document

export class SupportRequest {

    author: ID;

    sentAt: Date
    messages: Message[]

    isActive: boolean
}

@Schema()
class SSupportRequest {

    @Prop({ required: true })
    author: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    sentAt: Date

    @Prop()
    messages: Message[]

    @Prop()
    isActive: boolean
}

export const SupportRequestSchema = SchemaFactory.createForClass(SSupportRequest)