import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { JWT_SECRET } from 'src/const';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: (request: Request) => {
                if (!request || !request.cookies) return null;

                return request.cookies["jwt-token"];
            },
            secretOrKey: JWT_SECRET
        });
    }

    public async validate(payload: any) {
        const user = await this.authService.validateUser(payload.email, Buffer.from(payload.password));

        if (!user)
            throw new UnauthorizedException();

        return user;
    }
}