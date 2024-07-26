import "./Config.css"
import DarkModeSwitch from "../DrakModeSwitch/DarkModeSwitch";
import NewUser from "../NewUser/NewUser";
import UserInfo from "../UserInfo/UserInfo";
import React from "react";
import SignIn from "../SignIn/SignIn";
import {useAppContext} from "../../AppContext";


interface ConfigProps {
    toggleTheme: () => void;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
    connectWebSocket: () => Promise<void>;
}


const Config = (props: ConfigProps) => {
    const {state} = useAppContext();
    return (
        <div className="config-container">
            {/*<Ping />*/}
            <div className="auth-container">
                <div className="auth-inner-container">
                    {state.userInfo === null ?
                        <>
                            <SignIn
                                connectWebSocket={props.connectWebSocket}
                            />
                            <NewUser/>
                            <DarkModeSwitch toggleTheme={props.toggleTheme}/>
                        </>
                        : state.userInfo.isGuest ?
                            <>
                                <UserInfo
                                    username={state.userInfo.name}
                                    email={state.userInfo.email}
                                />
                                <SignIn
                                    connectWebSocket={props.connectWebSocket}
                                />
                                <NewUser/>
                                <DarkModeSwitch toggleTheme={props.toggleTheme}/>
                            </>
                            :
                            <>
                                <UserInfo
                                    username={state.userInfo.name}
                                    email={state.userInfo.email}
                                />
                                <DarkModeSwitch toggleTheme={props.toggleTheme}/>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Config;