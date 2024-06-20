import React, {useState} from 'react';
import './Chat.css';


interface ChatProps {
    socket: WebSocket | null;
    messages: string[]
}

const Chat = (props: ChatProps) => {
    const [message, setMessage] = useState('');


    const sendMessage = () => {
        if (props.socket && props.socket.readyState === WebSocket.OPEN) {
            props.socket.send(message);
            setMessage('');
        } else {
            console.log('WebSocket is not open');
        }
    };

    return (
        <div className="chat-container">
            <h1 className="title">Chat</h1>
            <div className="messages-container">
                {props.messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <div className="input-container">
                <input
                    className="chat-input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
