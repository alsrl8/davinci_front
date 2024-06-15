import {User} from "./User";

export type ChatObject = {
    messageType: number,
    user: User,
    message: string,
    time: string,
}

