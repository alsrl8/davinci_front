import {Button, Input} from "antd";
import "./SendInvitationButton.css"
import {sendApiRequest} from "../../utils/api";
import {useState} from "react";
import InvitationModal from "../InvitationModal/InvitationModal";
import {GameRoomInfo} from "../../types/GameRoom";

interface SendInvitationButtonProps {
    socket: WebSocket | null;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
    setRoomInfo: React.Dispatch<React.SetStateAction<GameRoomInfo | null>>
}

const SendInvitationButton = (props: SendInvitationButtonProps) => {
    const [invitationNameInput, setInvitationNameInput] = useState("");
    const [invitationUserName, setInvitationUserName] = useState("");
    const [invitationUserEmailList, setInvitationUserEmailList] = useState<string[]>([]);
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);

    const onSendInvitationButtonClick = async () => {
        if (invitationNameInput === "") return;

        const userEmailData = await sendApiRequest({
            method: "GET",
            endpoint: "user-email-by-name",
            body: null,
            server: "chat",
            params: {"name": invitationNameInput},
        })

        if (userEmailData.emails.length === 0) {
            alert(`There is no user with name (${invitationNameInput}) now.`)
            setInvitationNameInput("");
            return;
        }

        setInvitationUserName(invitationNameInput);
        setInvitationNameInput("");
        setInvitationUserEmailList(userEmailData.emails)
        setIsInvitationModalOpen(true);
    }

    return <div className="send-invitation-button-container">
        <Input
            className="send-invitation-input"
            placeholder={'input name'}
            value={invitationNameInput}
            onChange={(e) => setInvitationNameInput(e.target.value)}
        />
        <Button
            className="send-invitation-button"
            type={"primary"}
            onClick={onSendInvitationButtonClick}
        >
            Send
            Invitation
        </Button>
        <InvitationModal
            isModalOpen={isInvitationModalOpen}
            setModalOpen={setIsInvitationModalOpen}
            invitationUserName={invitationUserName}
            invitationUserEmailList={invitationUserEmailList}
            socket={props.socket}
            setSocket={props.setSocket}
            setRoomInfo={props.setRoomInfo}
        />
    </div>
}

export default SendInvitationButton;