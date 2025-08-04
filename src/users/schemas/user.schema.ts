import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ID } from "src/types";

export type UserDocument = User & Document

export class User {
    _id: ID;

    name: string

    salt: Buffer
    passwordHash: Buffer

    email: string
    contactPhone: string
    role: string
}

@Schema()
class SUser {

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    passwordHash: Buffer

    @Prop({ required: true })
    salt: Buffer

    @Prop({ required: true, unique: true })
    email: string

    @Prop()
    contactPhone: string

    @Prop({ required: true, default: "client" })
    role: string
}

export const UserSchema = SchemaFactory.createForClass(SUser)