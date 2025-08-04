import { Module } from "@nestjs/common";
import { SupportRequestService } from "./support.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SupportRequest, SupportRequestSchema } from "./schemas/request.schema";
import { Message, MessageSchema } from "./schemas/message.schema";
import { SupportRequestClientService } from "./support_client.service";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { SupportRequestEmployeeService } from "./support_employee.service";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SupportRequest.name, schema: SupportRequestSchema },
            { name: Message.name, schema: MessageSchema },
            { name: User.name, schema: UserSchema }
        ])
    ],
    controllers: [],
    providers: [SupportRequestService, SupportRequestClientService, SupportRequestEmployeeService ],
    exports: [ SupportRequestService, SupportRequestClientService, SupportRequestEmployeeService ]
})
export class SupportRequestModule {}