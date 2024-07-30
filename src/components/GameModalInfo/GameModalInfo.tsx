import "./GameModalInfo.css"
import SendInvitationButton from "../SendInvitationButton/SendInvitationButton";

interface GameModalInfoProps {
    gameRoomNumber: number | null;
}

const GameModalInfo = (props: GameModalInfoProps) => {
    return <>
        {props.gameRoomNumber === null ?
            <div className="game-start">
                <SendInvitationButton />
            </div>
            :
            <h1>Game {props.gameRoomNumber}</h1>
        }
    </>
}

export default GameModalInfo;