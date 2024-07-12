import {Button, Form, Input, Modal} from 'antd';
import {Dispatch, SetStateAction, useState} from "react";
import "./NewUserModal.css"

interface NewUserModalProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const NewUserModal = (props: NewUserModalProps) => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userEmailConfirmed, setUserEmailConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateEmailFormat = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const isUniqueEmail = async (email: string) => {
        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        try {
            const userValidationUrl = `${urlScheme}://${chatServerUrl}/user-validation`
            const response = await fetch(userValidationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userEmail: email,
                })
            });

            if (response.ok) {
                return true;
            } else {
                const data = await response.json()
                if (data.error !== undefined) {
                    alert(data.error);
                }
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    const validateEmail = async (email: string) => {
        if (!validateEmailFormat(email)) {
            setError('Invalid email format');
            setUserEmailConfirmed(false);
        } else if (!await isUniqueEmail(email)) {
            setError('');
            setUserEmailConfirmed(false);
        } else {
            setError('');
            setUserEmailConfirmed(true);
        }
    }

    const onClickOk = async () => {

        const chatServerUrl = process.env.REACT_APP_CHAT_SERVER_URL;
        const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";
        if (!chatServerUrl) {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        }

        try {
            const addUserUrl = `${urlScheme}://${chatServerUrl}/new-user`
            const response = await fetch(addUserUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userName: userName,
                    userEmail: userEmail,
                    password: userPassword
                })
            });

            if (response.ok) {
                clearUserInput();
                props.setIsModalOpen(false);
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
        setUserName('')
        setUserEmail('')
        setUserPassword('')
        setUserEmailConfirmed(false);
        setError(null);
    }

    return (
        <Modal
            open={props.isModalOpen}
            onOk={onClickOk}
            onCancel={onClickCancel}
            maskClosable={false}
            closable={false}
            okButtonProps={{disabled: !userEmailConfirmed}}
        >
            <Form>
                <Form.Item label="Name" className="label">
                    <Input value={userName} onChange={(e) => setUserName(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Email" validateStatus={error ? "error" : ""} help={error}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                               disabled={userEmailConfirmed}/>
                        <Button type="primary"
                                onClick={() => validateEmail(userEmail)}
                                disabled={userEmailConfirmed}
                        >
                            Validate Email
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default NewUserModal;