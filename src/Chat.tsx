import React, {useEffect, useState} from 'react'

const socket = new WebSocket('ws://localhost:8080/ws'); // 서버 주소에 맞게 변경

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (socket.readyState === WebSocket.OPEN) {
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
                onChange={e => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chat;