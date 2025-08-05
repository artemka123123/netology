import { Body, Controller, Get, HttpException, HttpStatus, Injectable, Param, ParseBoolPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { RoleGuard, Roles } from "src/auth/guards/role.guard";
import { SupportRequestClientService } from "./support_client.service";
import { SupportRequestEmployeeService } from "./support_employee.service";
import { CreateSupportRequestDto, SearchRequestsParams, SendMessageDto } from "./types/support.types";
import { SupportRequest } from "./schemas/request.schema";
import { IntegerValidationPipe } from "src/validation/int.validation.pipe";
import { SupportRequestService } from "./support.service";
import { firstValueFrom, from, map, toArray } from "rxjs";
import { UsersService } from "src/users/users.service";
import { ObjectIdValidationPipe } from "src/validation/objectid.validation.pipe";
import { ID } from "src/types";


@Controller()
export class SupportRequestController {

    constructor(
        private requestService: SupportRequestService,
        private clientService: SupportRequestClientService,
        private employeeService: SupportRequestEmployeeService,

        private userService: UsersService
    ) {}

    @Post("client/support-requests")    
    @Roles(["client"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createRequestClient(@Body() body, @Req() req) {
        const [ text ] = body;

        if (!text)
            throw new HttpException("Bad request.", HttpStatus.BAD_REQUEST);

        const user = req.user;
        const createRequest: CreateSupportRequestDto = {
            user: user._id,
            text: text
        }

        const request: SupportRequest = await this.clientService.createSupportRequest(createRequest)
        const hasNewMessages = await this.clientService.getUnreadCount(request._id) != 0;

        return {
            id: request._id,
            createdAt: request.sentAt.toISOString(),
            isActive: request.isActive,
            hasNewMessages: hasNewMessages
        }
    }

    @Get("client/support-requests/")
    @Roles(["client"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getRequestsClient(
        @Query("limit", new IntegerValidationPipe()) limit: number,
        @Query("offset", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 0)) offset: number,
        @Query("isActive", new ParseBoolPipe()) isActive: boolean,
        @Req() req
    ) {

        const user = req.user;

        const searchParams: SearchRequestsParams = {
            user: user._id,
            limit: limit,
            offset: offset,
            isActive: isActive
        }

        const requests = await this.requestService.searchSupportRequests(searchParams)
        const observable = from(requests)
            .pipe(
                map(async request => {

                    const hasNewMessages = await this.clientService.getUnreadCount(request._id) != 0;

                    return {
                        id: request._id,
                        createdAt: request.sentAt.toISOString(),
                        isActive: request.isActive,
                        hasNewMessages: hasNewMessages
                    }
                }),
                toArray()
            )

        return firstValueFrom(observable)
    }

    @Get("manager/support-requests/")
    @Roles(["manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getRequestsManager(
        @Query("limit", new IntegerValidationPipe()) limit: number,
        @Query("offset", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 0)) offset: number,
        @Query("isActive", new ParseBoolPipe()) isActive: boolean,
    ) {

        const searchParams = {
            user: null,
            limit: limit,
            offset: offset,
            isActive: isActive
        }

        const requests = await this.requestService.searchSupportRequests(searchParams);

        const observable = from(requests)
            .pipe(
                map(async request => {

                    const hasNewMessages = await this.employeeService.getUnreadCount(request._id) != 0;
                    const user = await this.userService.findById(request.author)
                    
                    return {
                        id: request._id,
                        createdAt: request.sentAt.toISOString(),
                        isActive: request.isActive,
                        hasNewMessages: hasNewMessages,

                        client: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            contactPhone: user.contactPhone
                        }
                    }

                }),

                toArray()
            )

        return firstValueFrom(observable)
    }

    @Get("common/support-requests/:id/messages")
    @Roles(["client", "manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getMessagesClient(@Param("id", new ObjectIdValidationPipe()) id: ID, @Req() req) {
    
        const user = req.user;
        const request = await this.requestService.getSupportRequest(id)

        if (user.role == "client" && request.author != user._id) 
            throw new HttpException("Request not found.", HttpStatus.NOT_FOUND)

        const observable = from(request.messages)
            .pipe(
                map(async message => {

                    const user = await this.userService.findById(message.author);

                    return {
                        id: message._id,
                        createdAt: message.sentAt,
                        text: message.text,
                        readAt: message.readAt,

                        author: {
                            id: user._id,
                            name: user._id
                        }
                    }
                }),
                toArray()
            )

        return firstValueFrom(observable)
    }

    @Post("common/support-requests/:id/messages")
    @Roles(["client", "manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async sendMessages(@Body() body, @Param("id", new ObjectIdValidationPipe()) id: ID, @Req() req) {
        const [ text ] = body;

        if (!text) 
            throw new HttpException("text is invalid.", HttpStatus.BAD_REQUEST);

        const user = req.user;
        const request = await this.requestService.getSupportRequest(id)

        if (user.role == "client" && request.author != user._id) 
            throw new HttpException("Request not found.", HttpStatus.NOT_FOUND)

        const sendMessage: SendMessageDto = {

            author: user._id,
            supportRequest: request._id,
            text: text

        }

        const message = await this.requestService.sendMessage(sendMessage)

        return {
            id: message._id,
            createdAt: message.sentAt,
            text: message.text,
            readAt: message.readAt,

            author: {
                id :user._id,
                name: user.name
            }
        }
    }

    @Post("common/support-requests/:id/messages/read")
    @Roles(["client", "manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async readMessage(@Body() body, @Param("id", new ObjectIdValidationPipe()) id: ID, @Req() req) {

        const [ createdBeforeParam ] = body;
        const user = req.user;

        if (!createdBeforeParam)
            throw new HttpException("createdBefore is invalid.", HttpStatus.BAD_REQUEST);

        const createdBefore = new Date(Date.parse(createdBeforeParam))

        if (user.role == "client") 
            this.clientService.markMessagesAsRead({ supportRequest: id, user: req.user._id, createdBefore: createdBefore })

        if (user.role == "manager")
            this.employeeService.markMessagesAsRead({ supportRequest: id, user: req.user._id, createdBefore: createdBefore })

        return {
            "success": true
        }
    }
}