import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IHotelService, SearchHotelParams, UpdateHotelParams } from "./types/hotels.types";
import { ID } from "src/types";
import { Hotel, HotelDocument } from "./schemas/hotel.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { firstValueFrom, from, skip, take } from "rxjs";


@Injectable()
export class HotelsService implements IHotelService {

    constructor(
        @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    async create(data: Partial<Hotel>): Promise<Hotel> {
        
        return await this.hotelModel.insertOne(data)

    }



    async findById(id: ID): Promise<Hotel> {
        const hotel = await this.hotelModel.findById(id);

        return hotel;
    }

    async findByTitle(title: string): Promise<Hotel> {
        const hotel = await this.hotelModel.findOne({ title: title });

        return hotel;
    }

    async search(params: SearchHotelParams): Promise<Hotel[]> {
        let title: string = params.title;
    
        const hotelParams = {
            title: title || { $exists: true }
        }

        const hotels: Promise<Hotel[]> = this.hotelModel.find(hotelParams)

        const observable = from(hotels)
            .pipe(
                skip(params.offset),
                take(params.limit)
            )
        
        return firstValueFrom(observable)
    }

    

    async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
        const hotel = await this.hotelModel.findById(id);

        if (!hotel)
            throw new HttpException("Hotel not found.", HttpStatus.NOT_FOUND)

        const searchParams = {
            _id: id
        }

        const updateParams = {
            $set: {
                title: data.title || hotel.title,
                description: data.description || hotel.description
            }
        }

        await this.hotelModel.updateOne(searchParams, updateParams)

        return await this.hotelModel.findById(id)
    }

}