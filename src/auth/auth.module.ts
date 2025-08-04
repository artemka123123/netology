import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { JWT_SECRET } from "src/const";


@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,

    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],

  controllers: [ AuthController ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}