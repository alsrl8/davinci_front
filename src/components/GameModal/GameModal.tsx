import {Modal} from "antd";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import React, {useState} from "react";
import "./GameModal.css"

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

const GameModal = (props: GameModalProps) => {
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState<Bounds>({left: 0, top: 0, right: 0, bottom: 0});


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

    return (
        <>
            <Modal
                title={
                    <div
                        className="modal-handle"
                        onMouseOver={() => setDisabled(false)}
                        onMouseOut={() => setDisabled(true)}
                        onMouseDown={() => setDisabled(true)}
                    />
                }
                open={props.isModalOpen}
                modalRender={(modal) => (
                    <Draggable disabled={disabled} bounds={bounds} onStart={onStart}>
                        <div>{modal}</div>
                    </Draggable>
                )}
                footer={null}
                onCancel={() => {props.setIsModalOpen(false)}}
                closable={false}
            >
                <p>Modal content can go here...</p>
            </Modal>
        </>
    );
}

export default GameModal;