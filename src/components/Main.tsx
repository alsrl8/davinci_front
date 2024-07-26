import React, {useEffect, useState} from 'react';

import {useTheme} from "../contexts/ThemeContext";
import Chat from "./Chat/Chat";
import "./Main.css";
import Config from "./Config/Config";
import {ChatObject} from "../types/Chat";
import {useAppContext} from "../AppContext";


const Main = () => {
    const {isDarkMode, toggleTheme} = useTheme();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const {state, dispatch} = useAppContext();

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    useEffect(() => {
        const fetchData = async () => {
            if (socket !== null) return;
            if (state.userInfo !== null) return;

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
                dispatch({type: 'CLEAR_USER_INFO'});
                return;
            }

            const data = await response.json();
            dispatch({type: 'SET_USER_INFO', payload: {name: data.name, email: data.email, isGuest: data.isGuest}});

            await connectWebSocket();
        };

        fetchData().then(() => {
            return
        });
    }, [dispatch, state.userInfo]);

    const connectWebSocket = async () => {
        if (socket !== null) {
            socket.close();
            setSocket(null);
        }

        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "wss" : "ws";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        const chatWsUrl = `${urlScheme}://${chatServerUrl}/ws`
        const newSocket = new WebSocket(chatWsUrl);
        newSocket.onopen = () => {
            setSocket(newSocket);
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
                setSocket={setSocket}
                connectWebSocket={connectWebSocket}
            />
        </div>
    );
};

export default Main;
