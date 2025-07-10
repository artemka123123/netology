import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { concatAll, firstValueFrom, from, lastValueFrom, map, mergeAll, Observable, pipe } from "rxjs";
import { Socket, Server } from 'socket.io';
import { CommentService } from "./comment.service";
import { BookComment } from "../schemas/comment.schema";

@WebSocketGateway({cors: true})
export class CommentsGateway {

    constructor(private readonly commentsService: CommentService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('getAllComments')
    async handleMessage(
        @MessageBody("book_id") bookId: string,
        @ConnectedSocket() client: Socket
    ): Promise<BookComment[]> {
        return this.commentsService.findComments(bookId)
    }

    @SubscribeMessage("addComment")
    async addComment(
        @MessageBody("comment_text") commentText: string,
        @MessageBody("book_id") bookId: string,
        @ConnectedSocket() client: Socket
    ) {
        return this.commentsService.createComment({ bookdId: bookId, comment: commentText })
    }
}