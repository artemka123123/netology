import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { catchError, map, Observable, tap, throwError } from "rxjs";


@Injectable()
export class MainInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {        
        const now = Date.now();

        return next
            .handle()
            .pipe(
                map((value) => {

                    return new Promise((resolve) => {
                        return resolve({
                            "status": "success",
                            "data": value
                        })
                    })

                }),
            );
    }
}