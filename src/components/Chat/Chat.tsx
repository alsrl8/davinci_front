import React, {useEffect, useRef, useState} from 'react';
import './Chat.css';


interface ChatProps {
    socket: WebSocket | null;
    messages: string[]
}

const Chat = (props: ChatProps) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '/') {
                if (document.activeElement !== inputRef.current) {
                    event.preventDefault();
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const sendMessage = () => {
        if (props.socket && props.socket.readyState === WebSocket.OPEN) {
            props.socket.send(message);
            setMessage('');
        } else {
            console.log('WebSocket is not open');
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            sendMessage();
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
                    placeholder="Press `/` to focus on input box"
                    ref={inputRef}
                    onKeyDown={handleInputKeyDown}
                />
                <button className="button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
