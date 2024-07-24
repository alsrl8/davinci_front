import "./SignIn.css";
import SignInModal from "./SignInModal";
import React, {useState} from "react";
import {UserInfoInterface} from "../Interface/UserInfo";

interface SignInProps {
    connectWebSocket: () => Promise<void>;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfoInterface | null>>
}

const SingIn = (props: SignInProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <button className="sing-in-button" onClick={handleClick}>Sign In</button>
            <SignInModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                connectWebSocket={props.connectWebSocket}
                setUserInfo={props.setUserInfo}
            />
        </>
    )
}

export default SingIn;