import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ID } from "src/types";

export type HotelDocument = Hotel & Document

export class Hotel {

    _id: ID;
    title: string
    description?: string
    createdAt: Date
    updatedAt: Date
}

@Schema()
class SHotel {

    @Prop({ required: true, unique: true })
    title: string

    @Prop()
    description?: string

    @Prop({ required: true })
    createdAt: Date

    @Prop({ required: true })
    updatedAt: Date
}

export const HotelSchema = SchemaFactory.createForClass(SHotel)