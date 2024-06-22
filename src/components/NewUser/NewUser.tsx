import "./NewUser.css"
import React, {useState} from "react";
import NewUserModal from "./NewUserModal";

const NewUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <button className="new-user-button" onClick={handleClick}>New User</button>
            <NewUserModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    )
}

export default NewUser;