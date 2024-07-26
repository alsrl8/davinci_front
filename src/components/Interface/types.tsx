import {UserInfoInterface} from "./UserInfo";

export interface AppState {
    userInfo: UserInfoInterface | null;
}

export type Action =
    | { type: 'SET_USER_INFO', payload: UserInfoInterface }
    | { type: 'CLEAR_USER_INFO' };