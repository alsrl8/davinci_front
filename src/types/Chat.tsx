import {User} from "./User";

enum Usertype {
    User,
    Admin ,
    Guest,
}

export type ChatObject = {
    messageType: number,
    user: User,
    message: string,
    time: string,
    userType: Usertype,
}

export type Message = {
    user: User,
    message: string,
    time: string,
    userType: Usertype,
}