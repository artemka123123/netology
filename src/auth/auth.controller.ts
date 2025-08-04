import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "crypto";
import { Response } from "express";
import { UsersService } from "src/users/users.service";
import { SignUpValidationSchema } from "src/users/validation/schemas/user.validation.schema";
import { SchemaValidationPipe } from "src/users/validation/users.validation.pipe";
import { JwtAuthGuard } from "./auth.guard";
import { expression } from "joi";

@Controller("api")
export class AuthController {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    @Post("auth/register")
    async signUp(@Body(new SchemaValidationPipe(SignUpValidationSchema)) body, @Res({ passthrough: true }) response: Response, @Req() request) {

        if (request.cookies)
            if (request.cookies["jwt-secret"])
                throw new HttpException("Already authenticated.", HttpStatus.BAD_REQUEST)

        const { email, name, password, contactPhone } = body;

        const salt = randomBytes(16);
        const hashed = createHash("sha256").update(password + salt).digest()

        const user = await this.usersService.create({
            name: name,
            email: email,

            salt: salt,
            passwordHash: hashed,

            contactPhone: contactPhone
        })

        response.cookie("jwt-token", this.jwtService.sign({ email: email, password: hashed }))

        return {
            id: user._id,
            email: user.email,
            name: user.name
        }
    }

    @Post("auth/login")
    @UseGuards(JwtAuthGuard)
    async login(@Req() req, @Res({ passthrough: true}) response: Response) {

        response.cookie("jwt-token", this.jwtService.sign({ email: req.user.email, password: req.user.passwordHash }))

        return {
            email: req.user.email,
            name: req.user.name,

            contactPhone: req.user.contactPhone
        }
    }

    @Post("auth/logout")
    @UseGuards(JwtAuthGuard)
    async logout(@Res({ passthrough: true }) response: Response) {

        response.clearCookie("jwt-secret")
    }
}