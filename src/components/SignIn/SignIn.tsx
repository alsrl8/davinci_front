import "./SignIn.css";
import SignInModal from "./SignInModal";
import {useState} from "react";

interface SignInProps {
    connectWebSocket: () => Promise<void>;
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
            />
        </>
    )
}

export default SingIn;