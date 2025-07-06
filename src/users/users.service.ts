import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

export type User = {
    id: number,

    email: string,
    firstName: string,
    lastName: string,

    password: string
};

@Injectable()
export class UsersService {

    Users: User[] = [

    ]

    createOne(user: UserDto) {
        const id = this.Users.length;

        this.Users.push({
            id: id,

            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password
        })

        return id;
    }

    findOne(email: string, password: string) {
        return this.Users.find((u) => u.email == email && u.password == password);
    }

}