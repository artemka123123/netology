import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, mongo, ObjectId } from "mongoose";
import { ID } from "src/types";

export type ReservationDocument = Reservation & Document

export class Reservation {

    _id: ID;

    userId: ID;
    hotelId: ID;
    roomId: ID;

    dateStart: Date;

    dateEnd: Date;

}

@Schema()
class SReservation {

    @Prop({ required: true })
    userId: mongoose.Schema.Types.ObjectId;
    
    @Prop({ required: true })
    hotelId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    roomId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ required: true })
    dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(SReservation)