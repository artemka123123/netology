import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { env } from "process";
import { AppService } from "src/app.service";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { UsersService } from "./users.service";
import { UserDto } from "./user.dto";

@Controller("api/users")
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body): string {
    const { email, firstName, lastName, password } = body;

    const id = this.userService.createOne({ email: email, firstName: firstName, lastName: lastName, password: password })

    return this.authService.createToken({ id: id, email: email, password: password });
  }



  @UseGuards(JwtAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return req.user;
  }
}
