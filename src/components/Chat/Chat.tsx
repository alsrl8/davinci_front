import React, {useState} from 'react';


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
        <div>
            <h1>Chat</h1>
            <div>
                {props.messages.map((msg, index) => (
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
