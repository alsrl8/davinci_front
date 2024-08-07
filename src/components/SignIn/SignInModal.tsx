import "./SingInModal.css";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Form, Input, Modal} from "antd";
import {useAppContext} from "../../AppContext";

interface SingInModalProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    connectWebSocket: () => Promise<void>;
}

const SignInModal = (props: SingInModalProps) => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const {dispatch} = useAppContext();

    const updateUserInfo = (name: string, email: string) => {
        dispatch({type: 'SET_USER_INFO', payload: {name: name, email: email, isGuest:false}});
    };

    const onClickOk = async () => {
        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        try {
            const addUserUrl = `${urlScheme}://${chatServerUrl}/login`
            const response = await fetch(addUserUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userEmail: userEmail,
                    password: userPassword
                })
            });

            if (response.ok) {
                clearUserInput();
                props.setIsModalOpen(false);
                await props.connectWebSocket();

                const data = await response.json();
                updateUserInfo(data.name, data.email);
            } else {
                const data = await response.json()
                if (data.error !== undefined) {
                    alert(data.error);
                }
            }
        } catch (error) {
            console.error('Error adding new user:', error);
        }
    }

    const onClickCancel = () => {
        props.setIsModalOpen(false);
        clearUserInput();
    }

    const clearUserInput = () => {
        setUserEmail('')
        setUserPassword('')
    }

    return (
        <Modal
            open={props.isModalOpen}
            onOk={onClickOk}
            onCancel={onClickCancel}
            maskClosable={false}
            closable={false}
        >
            <Form>
                <Form.Item label="Email">
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
                    </div>
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default SignInModal;