import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";


@Injectable()
export class MainInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {        
        const timestamp = new Date();

        return next
            .handle()
            .pipe(
                map((value) => {

                    return new Promise((resolve) => {
                        return resolve({
                            "timestamp": timestamp.toISOString(),
                            "status": "success",
                            "data": value,
                            "code": 200
                        })
                    })

                }),
            );
    }
}