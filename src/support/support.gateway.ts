import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { ID } from 'src/types';
import { Message } from './schemas/message.schema';
import { User } from 'src/users/schemas/user.schema';
import { HttpException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { WsAuthGuard, WsClient } from 'src/auth/guards/ws.auth.guard';
import { SupportRequestService } from './support.service';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestDocument } from './schemas/request.schema';
import { Model } from 'mongoose';

@WebSocketGateway({ cors: true })
export class SupportGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
    ) {}

    @SubscribeMessage("subscribeToChat")
    @UseGuards(WsAuthGuard, RoleGuard)
    async onSubscribeToChat(client: WsClient, @MessageBody() data: ID, @ConnectedSocket() socket: Socket) {

        if (!client.user)
            return 

        const user = client.user;
        const request = await this.supportRequestModel.findById(data)

        if (user.role == "client" && request.author != user._id) 
            throw new WsException("Request not found.");

        if (user.role != "client" && user.role != "manager")
            throw new WsException("Foribdden.");

        socket.join(request._id.toString())
    }

    async onMessage(message: Message, author: User, request: ID) {
        const sockets = await this.server.in(request.toString()).fetchSockets()

        sockets.forEach(socket => {

            socket.emit("message", {
                id: message._id,
                createdAt: message.sentAt,
                text: message.text,
                readAt: message.readAt,

                author: {

                    id: author._id,
                    name: author.name

                }
            })

        })
    }

}