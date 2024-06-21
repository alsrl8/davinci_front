import React from 'react';
import "./UserInfo.css";

interface UserInfoProps {
    username: string;
    email: string;
}


const UserInfo = (props: UserInfoProps) => {
    return (
        <div className="user-info">
            <p>{props.username}</p>
        </div>
    )
};

export default UserInfo;
