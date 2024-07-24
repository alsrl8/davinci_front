import "./Config.css"
import DarkModeSwitch from "../DrakModeSwitch/DarkModeSwitch";
import NewUser from "../NewUser/NewUser";
import {UserInfoInterface} from "../Interface/UserInfo";
import UserInfo from "../UserInfo/UserInfo";
import React from "react";
import SingIn from "../SignIn/SignIn";


interface ConfigProps {
    toggleTheme: () => void;
    userInfo: UserInfoInterface | null;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
    setMessages: React.Dispatch<React.SetStateAction<string[]>>;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfoInterface | null>>
    connectWebSocket: () => Promise<void>;
}


const Config = (props: ConfigProps) => {
    return (
        <div className="config-container">
            {/*<Ping />*/}
            <div className="auth-container">
                {props.userInfo === null ?
                    <div className="auth-inner-container">
                        <SingIn
                            connectWebSocket={props.connectWebSocket}
                            setUserInfo={props.setUserInfo}
                        />
                        <NewUser/>
                    </div>
                    :
                    <>
                        <UserInfo
                            username={props.userInfo.name}
                            email={props.userInfo.email}
                        />
                    </>
                }
            </div>
            <DarkModeSwitch toggleTheme={props.toggleTheme}/>
        </div>
    )
}

export default Config;