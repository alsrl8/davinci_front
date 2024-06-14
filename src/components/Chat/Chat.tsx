import React, {useEffect, useState} from 'react';

type User = {
    name: string,
}

type ChatObject = {
    messageType: number,
    user: User,
    message: string,
    time: string,
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL;

        if (!websocketUrl) {
            throw new Error("REACT_APP_WEBSOCKET_URL environment variable is not set");
        }

        const newSocket = new WebSocket(websocketUrl);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        newSocket.onmessage = (event) => {
            try {
                const chatData: ChatObject = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, chatData.message]);
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

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            setMessage('');
        } else {
            console.log('WebSocket is not open');
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
