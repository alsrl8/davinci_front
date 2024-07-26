import React, {useState} from "react";
import Config from "../Config/Config";
import './Menu.css'
import GameModal from "../GameModal/GameModal";


interface MenuProps {
    toggleTheme: () => void;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
    connectWebSocket: () => Promise<void>;
}


const Menu = (props: MenuProps) => {
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);

    const onGameModalButtonClick = () => {
        setIsGameModalOpen(true)
    }

    return (
        <>
            <div className="menu-container">
                <Config
                    toggleTheme={props.toggleTheme}
                    setSocket={props.setSocket}
                    connectWebSocket={props.connectWebSocket}
                />
                <div className="game-modal-button" onClick={onGameModalButtonClick}>Game</div>
            </div>
            <GameModal isModalOpen={isGameModalOpen}/>
        </>
    );
}

export default Menu;