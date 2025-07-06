import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Strategy, ExtractJwt } from "passport-jwt"
import { JWT_SECRET } from "src/constants";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET
        });
    }

    public async validate(payload: any) {
        const user = await this.authService.validateUser(payload.email, payload.password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}