import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ReservationsService } from "./reservation.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { RoleGuard } from "src/auth/role.guard";
import { HotelsService } from "src/hotels/hotels.service";
import { UsersService } from "src/users/users.service";
import { HotelRoom } from "src/hotels/schemas/room.schema";
import { HotelRoomsService } from "src/hotels/hotelrooms.service";
import { ReservationDto } from "./types/reservation.types";
import { firstValueFrom, flatMap, from, map, toArray } from "rxjs";
import mongoose from "mongoose";
import { ObjectIdValidationPipe } from "src/validation/objectid.validation.pipe";



@Controller("api")
export class ReservationController {

    constructor(
        private reservationService: ReservationsService,
        private hotelsService: HotelsService,
        private roomsService: HotelRoomsService,
        private usersService: UsersService
    ) {}

    @Post("client/reservation")
    @Roles(["client"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createReservation(@Body() body, @Req() req) {
        const [ hotelRoom, startDate, endDate ] = body;

        const user = req.user;
        const room = await this.roomsService.findById(hotelRoom)

        if (!room)
            throw new HttpException("Room is not found.", HttpStatus.BAD_REQUEST)

        if (!room.isEnabled)
            throw new HttpException("Room is disabled.", HttpStatus.BAD_REQUEST)

        const hotel = await this.hotelsService.findById(room.hotel);

        const createReservation: ReservationDto = {

            userId: user._id,
            hotelId: room.hotel,
            roomId: room._id,

            dateStart: startDate,
            dateEnd: endDate
        }

        const reservation = await this.reservationService.addReservation(createReservation)

        return {
            startDate: reservation.dateStart,
            endDate: reservation.dateEnd,

            hotelRoom: {
                description: room.description,
                images: room.images
            },

            hotel: {
                title: hotel.title,
                description: hotel.description
            }
        }
    }

    @Get("client/reservations")
    @Roles(["client"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getReservations(@Req() request) {
        const user = request.user;

        const reservations = await this.reservationService.getAllReservations(user._id);

        const observable = from(reservations)
            .pipe(
                map(async (reservation) => {

                    const room = await this.roomsService.findById(reservation.roomId)
                    const hotel = await this.hotelsService.findById(room.hotel)

                    return {
                        startDate: reservation.dateStart,
                        endDate: reservation.dateEnd,

                        hotelRoom: {
                            description: room.description,
                            images: room.images,
                        },

                        hotel: {
                            title: hotel.title,
                            description: hotel.description
                        }
                    }

                }),
                toArray()
            )
    
        return firstValueFrom(observable)
            
    }

    @Delete("client/reservations/:id")
    @Roles(["client"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async cancelReservation(@Body() body, @Req() request, @Param("id", new ObjectIdValidationPipe()) id: string) {

        const user = request.user;
        const reservation = await this.reservationService.findById(id);

        if (!reservation)
            throw new HttpException("Reservation not found.", HttpStatus.NOT_FOUND);

        if (user._id != reservation.userId)
            throw new HttpException("Can't cancel reservation.", HttpStatus.FORBIDDEN)

        this.reservationService.deleteById(id);
    }

    @Get("manager/reservations/:userId")
    @Roles(["manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getUserReservations(@Param("userId", new ObjectIdValidationPipe()) userId: string) {

        const reservations = await this.reservationService.getAllReservations(userId)

        const observable = from(reservations)
            .pipe(
                map(async (reservation) => {

                    const room = await this.roomsService.findById(reservation.roomId)
                    const hotel = await this.hotelsService.findById(room.hotel)
                    
                    return {
                        startDate: reservation.dateStart,
                        endDate: reservation.dateEnd,

                        hotelRoom: {
                            description: room.description,
                            images: room.images
                        },

                        hotel: {
                            title: hotel.title,
                            description: hotel.description
                        }
                    }
                }),
                toArray()
            )

        return firstValueFrom(observable)
    }

    @Delete("manager/reservations/:id")
    @Roles(["manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async cancelReservationManager(@Param("id", new ObjectIdValidationPipe()) id: string) {

        const reservation = await this.reservationService.findById(id);

        if (!reservation)
            throw new HttpException("Reservation not found.", HttpStatus.NOT_FOUND);

        this.reservationService.deleteById(id);
    }
}