import {List, Modal, Radio} from "antd";
import {useState} from "react";
import {sendApiRequest, sendWebSocketRequest} from "../../utils/api";
import {GameRoomInfo} from "../../types/GameRoom";

interface InvitationModalProps {
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    invitationUserName: string;
    invitationUserEmailList: string[];
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
    setRoomInfo: React.Dispatch<React.SetStateAction<GameRoomInfo | null>>
}

interface createRoomData {
    roomId: string;
    ownerEmail: string;
}

const InvitationModal = (props: InvitationModalProps) => {
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    const onOkButtonClick = async () => {
        const data: createRoomData = await sendApiRequest({
                method: "POST",
                endpoint: "create-room",
                body: {},
                server: "game",
                params: null,
            }
        )

        const socket = await sendWebSocketRequest({
            server: "game",
            endpoint: "",
            params: {},
            onOpen: () => {
                console.log(`game server(${data.roomId})에 붙었다!`)
            },
            onClose: () => {
            },
            onmessage: (event) => {
                // TODO Game Socket 연결 후, 메시지를 받았을 때 처리
            },
            onerror: (error) => {
                console.log('WebSocket error:', error);
                console.error('WebSocket Error: ', error);
            },
        })

        props.setSocket(socket);
        props.setRoomInfo({
            roomId: data.roomId,
            roomOwnerEmail: data.ownerEmail,
        })

        // TODO Invitation을 보내는 주체가 front-end로 되어 있는데 꼭 이렇게 해야 하는지? Game Server에서 Char Server로 요청을 보낼 수는 없는지?
        sendApiRequest(
            {
                method: "POST",
                body: {'userEmail': selectedEmail, 'roomId': data.roomId, 'roomOwnerEmail': data.ownerEmail},
                params: null,
                server: "chat",
                endpoint: "send-invitation"
            }
        ).then(r => {
        })
        props.setModalOpen(false);
    }

    const onCancelButtonClick = () => {
        props.setModalOpen(false);
    }

    return <Modal
        open={props.isModalOpen}
        closable={false}
        okText="Send"
        onOk={onOkButtonClick}
        onCancel={onCancelButtonClick}
    >
        <h2>{props.invitationUserName}</h2>
        {props.invitationUserEmailList.map((email, index) => (
            <List key={index}>
                <List.Item>
                    <Radio value={email} key={email} onChange={e => setSelectedEmail(e.target.value)}/>
                    {email}
                </List.Item>
            </List>
        ))}
    </Modal>
}

export default InvitationModal;