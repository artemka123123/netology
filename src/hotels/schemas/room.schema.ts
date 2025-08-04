import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Hotel } from "./hotel.schema";
import { ID } from "src/types";

export type HotelRoomDocument = HotelRoom & Document

export class HotelRoom {

    _id: ID;
    hotel: ID

    description: string
    createdAt: Date
    updatedAt: Date
    images: string[]

    isEnabled: boolean
}

@Schema()
class SHotelRoom {

    @Prop({ required: true, ref: Hotel.name })
    hotel: mongoose.Schema.Types.ObjectId

    @Prop()
    description: string

    @Prop({ required: true })
    createdAt: Date

    @Prop({ required: true })
    updatedAt: Date

    @Prop({ default: [] })
    images: string[]

    @Prop({ required: true, default: true })
    isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(SHotelRoom)