import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
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