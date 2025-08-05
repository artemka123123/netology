import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { HotelsService } from "./hotels.service";
import { IntegerValidationPipe } from "src/validation/int.validation.pipe";
import { CreateHotelRoomDto, SearchRoomsParams } from "./types/hotels.types";
import { filter, firstValueFrom, from, map, toArray } from "rxjs";
import { HotelRoomsService } from "./hotelrooms.service";
import { HotelRoom } from "./schemas/room.schema";
import mongoose from "mongoose";
import { RoleGuard } from "src/auth/guards/role.guard";
import { Roles } from "src/auth/guards/role.guard";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ObjectIdValidationPipe } from "src/validation/objectid.validation.pipe";

@Controller()
export class HotelsController {

    constructor(
        private readonly hotelsService: HotelsService,
        private readonly roomsService: HotelRoomsService
    ) {}

    @Get("common/hotel-rooms/")
    async getRooms(
        @Query("limit", new IntegerValidationPipe()) limit: number,
        @Query("offset", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 0)) offset: number,
        @Query("hotel", new ObjectIdValidationPipe()) hotelId: string
    ) {

        const searchParams: SearchRoomsParams = {
            limit: limit,
            offset: offset,
            hotel: hotelId
        }

        const hotel = await this.hotelsService.findById(hotelId);
        const rooms: HotelRoom[] = await this.roomsService.search(searchParams);
        
        const observable = from(rooms)
            .pipe(
                map((room) => { return {

                        id: room._id,
                        description: room.description,
                        images: room.images,

                        hotel: {
                            id: hotel._id,
                            title: hotel.title
                        }
                    } 
                }),

                toArray()
            )

        return firstValueFrom(observable);
    }

    @Get("common/hotel-rooms/:id")
    async getRoom(@Param("id") id: string) {

        const room = await this.roomsService.findById(id)
        const hotel = await this.hotelsService.findById(room.hotel);

        return {
            id: room._id,
            description: room.description,
            images: room.images,
            hotel: {
                id: hotel._id,
                title: hotel.title,
                description: hotel.description
            }
        }
    }

    @Post("admin/hotels/")
    @Roles(["admin"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createHotel(@Body() body) {
        const { title, description } = body;

        if (await this.hotelsService.findByTitle(title))
            throw new HttpException("Hotel with this title exists.", HttpStatus.BAD_REQUEST);

        if (!title || !description) 
            throw new HttpException("Invalid request.", HttpStatus.BAD_REQUEST);

        const date = new Date();

        const hotel = await this.hotelsService.create({
            title: title,
            description: description,
            createdAt: date,
            updatedAt: date
        })

        return {
            id: hotel._id,
            title: title,
            description: description
        }
    }

    @Get("admin/hotels/")
    @Roles(["admin"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getHotel(
        @Query("limit", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 100)) limit: number,
        @Query("offset", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 0)) offset: number,
        @Query("title") title: string
    ) {

        if (!title)
            title = ""

        const searchParams = {
            limit: limit,
            offset: offset,
            title: title
        }
    
        const hotels = await this.hotelsService.search(searchParams);
        const observable = from(hotels)
            .pipe(
                map(hotel => {

                    return {
                        id: hotel._id,
                        title: hotel.title,
                        description: hotel.description
                    }

                }),
                toArray()
            )

        return firstValueFrom(observable)
    }

    @Put("/admin/hotels/:id")
    @Roles(["admin"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async updateHotel(@Param("id", new ObjectIdValidationPipe()) id: string, @Body() body) {

        const [title, description] = body;

        if (!title || !description)
            throw new HttpException("Invalid body.", HttpStatus.BAD_REQUEST);

        const updatedHotel = await this.hotelsService.update(id, { title: title, description: description })
    
        return {
            id: updatedHotel._id,
            title: updatedHotel.title,
            description: updatedHotel.description
        }
    }

    private isFileImage(file: Express.Multer.File): boolean {
        return file.originalname.endsWith(".png") || file.originalname.endsWith(".jpeg") || file.originalname.endsWith(".jpg")
    } 

    @Post("admin/hotel-rooms/")
    @Roles(["admin"])
    @UseInterceptors(FilesInterceptor('images'))
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createRoom(@Body() body: CreateHotelRoomDto, @UploadedFiles() files: Express.Multer.File[]) {
        const hotel = await this.hotelsService.findById(body.hotelId)

        if (!hotel)
            throw new HttpException("Hotel not found.", HttpStatus.NOT_FOUND);
        
        const observable = from(files)
            .pipe(
                filter(file => this.isFileImage(file)),
                map(file => file.path),
                toArray()
            )

        const filePaths = await firstValueFrom(observable)
        const date = new Date()

        const room = await this.roomsService.create({
            
            hotel: body.hotelId,
            description: body.description,
            images: filePaths,

            createdAt: date,
            updatedAt: date

        })

        return {
            id: room._id,
            description: room.description,
            images: room.images,
            isEnabled: room.isEnabled,

            hotel: {
                id: room.hotel,
                title: hotel.title,
                description: hotel.description
            }
        }
    }

    @Put("admin/hotel-rooms/:id")
    @Roles(["admin"])
    @UseInterceptors(FilesInterceptor('images'))
    @UseGuards(JwtAuthGuard, RoleGuard)
    async updateRoom(@Param("id", new ObjectIdValidationPipe()) id: string, @Body() body, @UploadedFiles() files: Express.Multer.File[]) {
        const [ description, hotelId, isEnabled ] = body

        const room = await this.roomsService.findById(id);

        const observable = from(files)
            .pipe(
                filter(file => this.isFileImage(file)),
                map(file => file.path),
                toArray()
            )

        const filePaths = await firstValueFrom(observable)

        const updatedRoom = await this.roomsService.update(id, {
            description: description || room.description,
            hotel: room.hotel || hotelId,

            isEnabled: room.isEnabled || isEnabled,
            images: filePaths
        })

        const hotel = await this.hotelsService.findById(updatedRoom.hotel);

        return {
            id: updatedRoom._id,
            description: updatedRoom.description,
            images: updatedRoom.images,
            isEnabled: updatedRoom.isEnabled,
            hotel: {
                id: updatedRoom.hotel,
                title: hotel.title,
                description: hotel.description
            }
        }
    }
}