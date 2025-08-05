import { Module } from "@nestjs/common";
import { SupportRequestService } from "./support.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SupportRequest, SupportRequestSchema } from "./schemas/request.schema";
import { Message, MessageSchema } from "./schemas/message.schema";
import { SupportRequestClientService } from "./support_client.service";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { SupportRequestEmployeeService } from "./support_employee.service";
import { UsersService } from "src/users/users.service";
import { SupportGateway } from "./support.gateway";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JWT_SECRET } from "src/const";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SupportRequest.name, schema: SupportRequestSchema },
            { name: Message.name, schema: MessageSchema },
            { name: User.name, schema: UserSchema }
        ]),
        
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [],
    providers: [SupportRequestService, SupportRequestClientService, SupportRequestEmployeeService, UsersService, SupportGateway ],
    exports: [ SupportRequestService, SupportRequestClientService, SupportRequestEmployeeService, SupportGateway ]
})
export class SupportRequestModule {}