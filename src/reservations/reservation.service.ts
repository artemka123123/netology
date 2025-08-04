import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IReservationService, ReservationDto, ReservationSearchOptions } from "./types/reservation.types";
import { ID } from "src/types";
import { Reservation, ReservationDocument } from "./schemas/reservation.schema";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { Connection, Model } from "mongoose";
import { Hotel, HotelDocument } from "src/hotels/schemas/hotel.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { HotelRoom, HotelRoomDocument } from "src/hotels/schemas/room.schema";
import { firstValueFrom, from, map } from "rxjs";



@Injectable()
export class ReservationsService implements IReservationService {

    constructor(

        @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
        @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,

        @InjectConnection() private connection: Connection

    ) {

    }

    isDatesOverlap = (reservation: Reservation, dateStart: Date, dateEnd: Date) => {
        return reservation.dateEnd >= dateStart && dateEnd >= reservation.dateStart;
    }

    async addReservation(data: ReservationDto): Promise<Reservation> {
        const hotel = await this.hotelModel.findById(data.hotelId);
        const user = await this.userModel.findById(data.userId);
        const room = await this.roomModel.findById(data.roomId);

        if (!hotel)
            throw new HttpException("Hotel not found.", HttpStatus.NOT_FOUND)

        if (!user)
            throw new HttpException("User not found.", HttpStatus.NOT_FOUND)

        if (!room)
            throw new HttpException("Room not found.", HttpStatus.NOT_FOUND);
    
        const reservations: Promise<ReservationDocument[]> = this.reservationModel.find({ hotelId: data.hotelId, roomId: data.roomId })

        const observable = from(reservations)
            .pipe(
                map(
                    (query) => query
                        .filter((value) => value.roomId == data.roomId)
                        .filter((value) => this.isDatesOverlap(value, data.dateStart, data.dateEnd))
                )
            )

        const overlappingReservations: ReservationDocument[] = await firstValueFrom(observable)

        if (overlappingReservations.length != 0) 
            throw new HttpException("This room is not availlable.", HttpStatus.BAD_REQUEST)

        return await this.reservationModel.insertOne(data)
    }

    async removeReservation(id: ID): Promise<void> {
        
        await this.reservationModel.deleteOne({_id: id})

    }

    async deleteById(id: ID) {

        await this.reservationModel.deleteOne({ _id: id })

    }

    async findById(id: ID): Promise<Reservation> {
        return await this.reservationModel.findById(id);
    }

    async getAllReservations(userId: ID): Promise<Reservation[]> {
        const reservations: Promise<ReservationDocument[]> = this.reservationModel.find({ userId: userId })

        return await reservations;
    }

    async getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
        const searchParams = {
            userId: filter.userId
        }

        const reservations: Promise<ReservationDocument[]> = this.reservationModel.find(searchParams)

        const observable = from(reservations)
            .pipe(
                map(
                    (query) => query
                        .filter((value: Reservation) => value.userId == filter.userId)
                        .filter((value: Reservation) => this.isDatesOverlap(value, filter.dateStart, filter.dateEnd))
                )
            )

        return firstValueFrom(observable);
    }
}