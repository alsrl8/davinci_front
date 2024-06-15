import React, {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import auth from '../../config/firebaseConfig';
import {ChatObject} from "../../types/Chat";

interface AuthProps {
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
    setMessages: React.Dispatch<React.SetStateAction<string[]>>;
}


const Auth = (props: AuthProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            const refreshToken = userCredential.user.refreshToken;

            const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
            const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
            if (!chatServerUrl) {
                throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
            }

            const chatLoginUrl = `${urlScheme}://${chatServerUrl}/login`
            const response = await fetch(chatLoginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                }),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Server login successful');
                await connectWebSocket(idToken);
            } else {
                console.error('Server login failed:', response.statusText);
            }

        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const connectWebSocket = async (idToken: string) => {
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   placeholder="Password"/>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Auth;