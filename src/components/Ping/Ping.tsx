import "./Ping.css"
import React from "react";

const Ping = () => {

    const handleClick = async () => {
        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        try {
            const chatLoginUrl = `${urlScheme}://${chatServerUrl}:8080/ping`
            const response = await fetch(chatLoginUrl);

            if (response.ok) {
                console.log('Ping sent');
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Ping-Pong failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error ping-pong:', error);
        }
    }

    return (
        <>
            <button className="ping-button" onClick={handleClick}>Ping</button>
        </>
    )
}

export default Ping;