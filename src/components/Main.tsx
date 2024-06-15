import React, {useEffect, useState} from 'react';

import {useTheme} from "../contexts/ThemeContext";
import DarkModeSwitch from "./DrakModeSwitch/DarkModeSwitch";
import Chat from "./Chat/Chat";
import Auth from "./Auth/Auth";


const Main = () => {
    const {isDarkMode, toggleTheme} = useTheme();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    return (
        <div>
            <Auth setSocket={setSocket} setMessages={setMessages}/>
            <Chat socket={socket} messages={messages}/>
            <DarkModeSwitch toggleTheme={toggleTheme}/>
        </div>
    );
};

export default Main;
