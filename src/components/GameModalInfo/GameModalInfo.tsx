import "./GameModalInfo.css"
import SendInvitationButton from "../SendInvitationButton/SendInvitationButton";
import {GameRoomInfo} from "../../types/GameRoom";

interface GameModalInfoProps {
    socket: WebSocket | null;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
    roomInfo: GameRoomInfo | null;
    setRoomInfo: React.Dispatch<React.SetStateAction<GameRoomInfo | null>>
}

const GameModalInfo = (props: GameModalInfoProps) => {
    return <>
        {props.socket === null ?
            <div className="game-start">
                <SendInvitationButton
                    setSocket={props.setSocket}
                    setRoomInfo={props.setRoomInfo}
                />
            </div>
            :
            <h1>Game {props.roomInfo?.roomId}</h1>
        }
    </>
}

export default GameModalInfo;