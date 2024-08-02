import React, {useEffect, useState} from 'react';

import {useTheme} from "../contexts/ThemeContext";
import Chat from "./Chat/Chat";
import "./Main.css";
import Menu from "./Menu/Menu";
import {ChatObject, GameInvitationObject, Message, UserType} from "../types/Chat";
import {useAppContext} from "../AppContext";
import {sendApiRequest, sendWebSocketRequest} from "../utils/api";


const Main = () => {
    const {isDarkMode, toggleTheme} = useTheme();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [number, setNumber] = useState(0);
    const {state, dispatch} = useAppContext();

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    useEffect(() => {
        const fetchData = async () => {
            if (socket !== null) return;
            else if (state.userInfo !== null) return;

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
    }, [state.userInfo]);

    useEffect(() => {
        const getActiveUserNum = () => sendApiRequest(
            {
                server: 'chat',
                method: 'GET',
                endpoint: 'count-active-user',
                params: {},
                body: null,
            }
        )

        getActiveUserNum().then((data) => {
            setNumber(data.number);
            return
        });
    }, [messages])

    const connectWebSocket = async () => {
        const newSocket = await sendWebSocketRequest(
            {
                prevSocket: socket,
                setPrevSocket: setSocket,
                params: {},
                endpoint: 'ws',
                server: "chat",
                onmessage: (event) => {
                    try {
                        const chatData: ChatObject = JSON.parse(event.data);
                        switch (chatData.userType) {
                            case UserType.GameInvitation:
                                const gameInvitationData: GameInvitationObject = JSON.parse(event.data);
                                setMessages((prevMessages) => [...prevMessages,
                                    {
                                        userType: gameInvitationData.userType,
                                        user: gameInvitationData.user,
                                        time: gameInvitationData.time,
                                        message: gameInvitationData.message,
                                        link: {
                                            endpoint: '',
                                            params: {'roomId': gameInvitationData.roomId}
                                        }
                                    }
                                ]);
                                break
                            default:
                                setMessages((prevMessages) => [...prevMessages,
                                    {
                                        userType: chatData.userType,
                                        user: chatData.user,
                                        time: chatData.time,
                                        message: chatData.message,
                                        link: null,
                                    }
                                ]);
                        }
                    } catch (error) {
                        setMessages((prevMessages) => [...prevMessages, event.data]);
                        console.log("Failed to parse the incoming data. Error: ", error);
                    }
                },
                onerror: (error) => {
                    console.log('WebSocket error:', error);
                    console.error('WebSocket Error: ', error);
                },
                onOpen: () => {
                },
                onClose: () => {

                }
            }
        )
        setSocket(newSocket);
    }

    return (
        <>
            <div className="main-container">
                <div className="chat-container">
                    <Chat
                        socket={socket}
                        messages={messages}
                        number={number}
                    />
                </div>
                <Menu
                    toggleTheme={toggleTheme}
                    setSocket={setSocket}
                    connectWebSocket={connectWebSocket}
                />
            </div>
        </>
    );
};

export default Main;
