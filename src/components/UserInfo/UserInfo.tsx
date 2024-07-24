import React from 'react';
import "./UserInfo.css";
import Cookies from "js-cookie";

interface UserInfoProps {
    username: string;
    email: string;
}


const UserInfo = (props: UserInfoProps) => {
    const onClick = () => {
        Cookies.remove('token', {domain: '.songmingi.com', path: '/'});
        window.location.reload();
    }

    return (
        <div className="user-info" onClick={onClick}>
            <p>{props.username}</p>
        </div>
    )
};

export default UserInfo;
