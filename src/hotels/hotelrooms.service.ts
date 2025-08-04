import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IHotelRoomService, SearchRoomsParams } from "./types/hotels.types";
import { ID } from "src/types";
import { HotelRoom, HotelRoomDocument } from "./schemas/room.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { firstValueFrom, from, map, skip, take } from "rxjs";

@Injectable()
export class HotelRoomsService implements IHotelRoomService {

    constructor(
        @InjectModel(HotelRoom.name) private hotelModel: Model<HotelRoomDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    create(data: Partial<HotelRoom>): Promise<HotelRoom> {
        
        return this.hotelModel.insertOne(data)

    }

    findById(id: ID): Promise<HotelRoom> {

        return this.hotelModel.findById(id);

    }

    async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
        const searchParams = {
            hotel: params.hotel || {},
        }

        const isEnabled = (hotel) => {
            if (!params.isEnabled) return false;

            return hotel.isEnabled == params.isEnabled;
        };

        const rooms: Promise<HotelRoomDocument[]> = this.hotelModel.find(searchParams);
        const observable = from(rooms)
            .pipe(
                map((query) => query.filter((value) => isEnabled(value))),
                skip(params.offset),
                take(params.limit)
            )

        return firstValueFrom(observable)
    }

    async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
        
        const room = await this.hotelModel.findById(id);
    
        if (!room)
            throw new HttpException("Hotel not found.", HttpStatus.NOT_FOUND)

        const searchParams = {
            _id: id
        }

        const date = new Date()

        const updateParams = {
            $set: {
                description: data.description || room.description,
                images: data.images || room.images,
                isEnabled: data.isEnabled || room.isEnabled,

                updatedAt: date
            }
        }

        await this.hotelModel.updateOne(searchParams, updateParams)

        return await this.hotelModel.findById(id)
    }
}