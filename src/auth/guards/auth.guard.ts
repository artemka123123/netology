import { ExecutionContext, CanActivate, Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";


@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {

    constructor() {
        super({ usernameField: "email" })
    }

    canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> | boolean {
        return super.canActivate(context);
    }
}