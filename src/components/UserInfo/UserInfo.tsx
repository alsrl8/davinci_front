import React, {useReducer} from 'react';
import "./UserInfo.css";
import {useAppContext} from "../../AppContext";

interface UserInfoProps {
    username: string;
    email: string;
}

const logout = async () => {
    const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
    const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
    if (!chatServerUrl) {
        throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
    }

    try {
        const addUserUrl = `${urlScheme}://${chatServerUrl}/logout`
        const response = await fetch(addUserUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json()
            if (data.error !== undefined) {
                alert(data.error);
            }
        }
    } catch (error) {
        console.error('Error adding new user:', error);
    }
}


const UserInfo = (props: UserInfoProps) => {
    const {state} = useAppContext();

    const onClick = async () => {
        if (state.userInfo?.isGuest) {
            return;
        }
        await logout()
        window.location.reload();
    }

    return (
        <div className="user-info" onClick={onClick}>
            <p>{props.username}</p>
        </div>
    )
};

export default UserInfo;
