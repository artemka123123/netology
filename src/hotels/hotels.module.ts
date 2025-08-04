import { Module } from "@nestjs/common";
import { HotelsController } from "./hotels.controller";
import { HotelsService } from "./hotels.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "./schemas/hotel.schema";
import { HotelRoom, HotelRoomSchema } from "./schemas/room.schema";
import { HotelRoomsService } from "./hotelrooms.service";
import { MulterModule } from "@nestjs/platform-express";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Hotel.name, schema: HotelSchema },
            { name: HotelRoom.name, schema: HotelRoomSchema }
        ]),

        MulterModule.register({
            dest: "./uploads",
            preservePath: true
        }),
    ],

    controllers: [HotelsController],
    providers: [HotelsService, HotelRoomsService],
    exports: [ HotelsService, HotelRoomsService ]
})
export class HotelsModule {}