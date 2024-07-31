import {Button, Modal} from "antd";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import React, {useState} from "react";
import "./GameModal.css"
import GameModalInfo from "../GameModalInfo/GameModalInfo";
import {GameRoomInfo} from "../../types/GameRoom";

interface GameModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface GameModalSize {
    size: 'small' | 'medium' | 'large';
}


const GameModal = (props: GameModalProps) => {
    const [size, setSize] = useState<GameModalSize>({size: 'large'});
    const [bounds, setBounds] = useState<Bounds>({left: 0, top: 0, right: 0, bottom: 0});
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomInfo, setRoomInfo] = useState<GameRoomInfo | null>(null);

    const onStart = (event: DraggableEvent, uiData: DraggableData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = uiData.node.getBoundingClientRect();
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y)
        });
    };


    const onSmallSizeButtonClick = () => {
        setSize({size: 'small'});
    }

    const onMediumSizeButtonClick = () => {
        setSize({size: 'medium'});
    }

    const onLargeSizeButtonClick = () => {
        setSize({size: 'large'});
    }

    const getModalSize = () => {
        switch (size.size) {
            case 'small':
                return {width: 0.3 * window.innerWidth, height: 0.3 * window.innerHeight};
            case 'large':
                return {width: 0.8 * window.innerWidth, height: 0.8 * window.innerHeight};
            default:
                return {width: 0.6 * window.innerWidth, height: 0.6 * window.innerHeight};
        }
    };

    return (
        <>
            <Modal
                styles={{
                    body: {
                        height: getModalSize().height
                    }
                }}
                width={getModalSize().width}
                title={
                    <div
                        className="modal-handle"
                    />
                }
                open={props.isModalOpen}
                modalRender={(modal) => (
                    <Draggable
                        handle={".modal-handle"}
                        bounds={bounds}
                        onStart={onStart}
                    >
                        {modal}
                    </Draggable>
                )}
                footer={null}
                onCancel={() => {
                    props.setIsModalOpen(false)
                }}
                closable={false}
            >
                <div className="size-button-container">
                    <Button className="size-button" onClick={onSmallSizeButtonClick}>S</Button>
                    <Button className="size-button" onClick={onMediumSizeButtonClick}>M</Button>
                    <Button className="size-button" onClick={onLargeSizeButtonClick}>L</Button>
                </div>
                <GameModalInfo
                    socket={socket}
                    setSocket={setSocket}
                    roomInfo={roomInfo}
                    setRoomInfo={setRoomInfo}
                />
            </Modal>
        </>
    );
}

export default GameModal;