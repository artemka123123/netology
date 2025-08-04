import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { RoleGuard } from "src/auth/role.guard";
import { Roles } from "src/auth/roles.decorator";
import { createHash, randomBytes } from "crypto";
import { IntegerValidationPipe } from "src/validation/int.validation.pipe";
import { EmailRegExp, PhoneRegExp, RegExpValidationPipe } from "src/validation/regexp.validation.pipe";
import { firstValueFrom, from, map, toArray } from "rxjs";

@Controller("api")
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post("admin/users/")
    @Roles(["admin"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createUser(@Body() body) {
        const [email, password, name, contactPhone, role] = body; 

        const salt = randomBytes(16);
        const hashed = createHash("sha256").update(password + salt).digest()

        const user = await this.usersService.create({
            email: email,
            passwordHash: hashed,
            salt: salt,
            name: name,
            contactPhone: contactPhone,
            role: role
        })

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
            role: user.role
        }
    }
    @Get("admin/users/")
    @Roles(["admin"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getUsersAdmin(
        @Query("limit", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 100)) limit: number,
        @Query("offset", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 0)) offset: number,
        @Query("name") name: string,
        @Query("email", new RegExpValidationPipe(EmailRegExp)) email: string,
        @Query("contactPhone", new RegExpValidationPipe(PhoneRegExp)) contactPhone: string
    ) {

        const usersSearchParams = {
            limit: limit,
            offset: offset,
            name: name,
            email: email,
            contactPhone: contactPhone
        }

        const users = await this.usersService.findAll(usersSearchParams)

        const observable = from(users)
            .pipe(
                map(user => {
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        contactPhone: user.contactPhone
                    }
                }),
                toArray()
            )

        return firstValueFrom(observable)
    }

    @Get("manager/users/")
    @Roles(["manager"])
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getUsers(
        @Query("limit", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 100)) limit: number,
        @Query("offset", new IntegerValidationPipe(0, Number.MAX_SAFE_INTEGER, 0)) offset: number,
        @Query("name") name: string,
        @Query("email", new RegExpValidationPipe(EmailRegExp)) email: string,
        @Query("contactPhone", new RegExpValidationPipe(PhoneRegExp)) contactPhone: string
    ) {

        const usersSearchParams = {
            limit: limit,
            offset: offset,
            name: name,
            email: email,
            contactPhone: contactPhone
        }

        const users = await this.usersService.findAll(usersSearchParams)

        const observable = from(users)
            .pipe(
                map(user => {
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        contactPhone: user.contactPhone
                    }
                }),
                toArray()
            )

        return firstValueFrom(observable)
    }
}