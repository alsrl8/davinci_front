import React, {useEffect, useState} from 'react';
import {signInWithEmailAndPassword, UserCredential} from 'firebase/auth';
import auth from '../../config/firebaseConfig';
import {ChatObject} from "../../types/Chat";
import UserInfo from "../UserInfo/UserInfo";


interface UserInfoInterface {
    name: string;
    email: string;
}

interface AuthProps {
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
    setMessages: React.Dispatch<React.SetStateAction<string[]>>;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfoInterface | null>>
}


const Auth = (props: AuthProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function loginToChatServer(email: string, password: string) {
        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        try {
            const chatLoginUrl = `${urlScheme}://${chatServerUrl}/login`
            const response = await fetch(chatLoginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: email,
                    password: password,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                props.setUserInfo(prev => {
                    return {
                        name: data.name,
                        email: data.email,
                    }
                })
            } else {
                console.error('Server login failed:', response.statusText);
            }

        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const handleLogin = async () => {
        await loginToChatServer(email, password);
    };

    const connectWebSocket = async () => {
        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "wss" : "ws";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        const chatWsUrl = `${urlScheme}://${chatServerUrl}/ws`
        const newSocket = new WebSocket(chatWsUrl);
        newSocket.onopen = () => {
            props.setSocket(newSocket);
            console.log('WebSocket connection established');
        };
        newSocket.onmessage = (event) => {
            try {
                const chatData: ChatObject = JSON.parse(event.data);
                props.setMessages((prevMessages) => [...prevMessages, chatData.message]);
            } catch (error) {
                props.setMessages((prevMessages) => [...prevMessages, event.data]);
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
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"/>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Auth;
