import { Module } from "@nestjs/common";
import { ReservationsService } from "./reservation.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "./schemas/reservation.schema";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { Hotel, HotelSchema } from "src/hotels/schemas/hotel.schema";
import { HotelRoom, HotelRoomSchema } from "src/hotels/schemas/room.schema";
import { HotelsService } from "src/hotels/hotels.service";
import { UsersService } from "src/users/users.service";
import { HotelRoomsService } from "src/hotels/hotelrooms.service";



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reservation.name, schema: ReservationSchema },
            { name: User.name, schema: UserSchema },
            { name: Hotel.name, schema: HotelSchema },
            { name: HotelRoom.name, schema: HotelRoomSchema }
        ]),
    ],
    controllers: [],
    providers: [ReservationsService, HotelsService, HotelRoomsService, UsersService]
})
export class ReservationsModule {}