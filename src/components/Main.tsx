import React, {useEffect, useState} from 'react';

import {useTheme} from "../contexts/ThemeContext";
import DarkModeSwitch from "./DrakModeSwitch/DarkModeSwitch";
import Chat from "./Chat/Chat";
import Auth from "./Auth/Auth";
import "./Main.css";
import UserInfo from "./UserInfo/UserInfo";

interface UserInfoInterface {
    name: string;
    email: string;
}

const Main = () => {
    const {isDarkMode, toggleTheme} = useTheme();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    return (
        <div className="main-container">
            <div className="auth-container">
                {userInfo === null ?
                    <Auth setSocket={setSocket} setMessages={setMessages} setUserInfo={setUserInfo}/> :
                    <UserInfo username={userInfo.name} email={userInfo.email}/>
                }
            </div>
            <div className="chat-container">
                <Chat socket={socket} messages={messages}/>
            </div>
            <DarkModeSwitch toggleTheme={toggleTheme}/>
        </div>
    );
};

export default Main;
