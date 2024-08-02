import {User} from "./User";

export enum UserType {
    User,
    Admin,
    Guest,
    GameInvitation
}

export type ChatObject = {
    messageType: number,
    user: User,
    message: string,
    time: string,
    userType: UserType,
}

export type GameInvitationObject = {
    messageType: number,
    user: User,
    message: string,
    time: string,
    userType: UserType,
    roomId: string,
}

export type Message = {
    user: User,
    message: string,
    time: string,
    userType: UserType,
    link: {
        endpoint: string | null;
        params: object | null;
    } | null;
}