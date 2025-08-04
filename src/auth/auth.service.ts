import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "crypto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: Buffer): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        
        if (Buffer.compare(user.passwordHash, password) != 0)
            throw new HttpException("Invalid password.", HttpStatus.BAD_REQUEST);

        if (user)
            return user;
        
        return null;
    }

    async createToken(email: string, password: string) {
        return this.jwtService.sign({ email: email, password: password });
    }
}