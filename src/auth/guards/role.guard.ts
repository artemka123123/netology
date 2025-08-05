import { ExecutionContext, CanActivate, Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export const Roles = Reflector.createDecorator<string[]>();

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const roles = this.reflector.get(Roles, context.getHandler())
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        if (!request.user) return false;

        return roles.includes(request.user.role);
    }
}