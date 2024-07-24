import React, {useEffect, useState} from 'react';

import {useTheme} from "../contexts/ThemeContext";
import Chat from "./Chat/Chat";
import "./Main.css";
import Config from "./Config/Config";
import {UserInfoInterface} from "./Interface/UserInfo";
import {ChatObject} from "../types/Chat";


const Main = () => {
    const {isDarkMode, toggleTheme} = useTheme();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    useEffect(() => {
        const fetchData = async () => {
            if (userInfo !== null) return;

            const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
            const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";

            const addUserUrl = `${urlScheme}://${chatServerUrl}/auto-login`
            const response = await fetch(addUserUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                setUserInfo(null);
                return;
            }

            const data = await response.json();
            setUserInfo(prev => {
                return {
                    "name": data.name,
                    "email": data.email,
                }
            })

            await connectWebSocket();
        };

        fetchData().then(r => {
            return
        });
    }, [userInfo]);

    const connectWebSocket = async () => {
        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "wss" : "ws";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        const chatWsUrl = `${urlScheme}://${chatServerUrl}/ws`
        const newSocket = new WebSocket(chatWsUrl);
        newSocket.onopen = () => {
            setSocket(newSocket);
            console.log('WebSocket connection established');
        };
        newSocket.onmessage = (event) => {
            try {
                const chatData: ChatObject = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, "[" + chatData.user + "] " + chatData.message]);
            } catch (error) {
                setMessages((prevMessages) => [...prevMessages, event.data]);
                console.log("Failed to parse the incoming data. Error: ", error);
            }
        };
        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        newSocket.onerror = (error) => {
            console.log('WebSocket error:', error);
            console.error('WebSocket Error: ', error);
        };
    }

    return (
        <div className="main-container">
            <div className="chat-container">
                <Chat
                    socket={socket}
                    messages={messages}
                />
            </div>
            <Config
                toggleTheme={toggleTheme}
                userInfo={userInfo}
                setSocket={setSocket}
                setMessages={setMessages}
                setUserInfo={setUserInfo}
                connectWebSocket={connectWebSocket}
            />
        </div>
    );
};

export default Main;
