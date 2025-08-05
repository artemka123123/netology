import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Response } from "express";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const timestamp = new Date();

        response
            .status(status)
            .json({
                timestamp: timestamp.toISOString(),
                status: "error",
                data: exception.message,
                code: status
            })
    }
}

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {

    async catch(exception: WsException, host: ArgumentsHost) {
        const ctx = host.switchToWs();
        const client = ctx.getClient();
        const timestamp = new Date();

        client.emit("error", {
            timestamp: timestamp.toISOString(),
            status: "error",
            data: exception.message
        })
    }

}