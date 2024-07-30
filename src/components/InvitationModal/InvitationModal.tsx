import {List, Modal, Radio} from "antd";
import {useState} from "react";
import {sendApiRequest} from "../../utils/api";

interface InvitationModalProps {
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    invitationUserName: string;
    invitationUserEmailList: string[];
}

const InvitationModal = (props: InvitationModalProps) => {
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    const onOkButtonClick = () => {
        sendApiRequest(
            {
                method: "POST",
                body: {'userEmail': selectedEmail},
                params: null,
                server: "chat",
                endpoint: "send-invitation"
            }
        ).then(r => {})
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