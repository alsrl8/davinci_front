import {Button, Modal} from "antd";
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

interface GameModalSize {
    size: 'small' | 'medium' | 'large';
}

const GameModal = (props: GameModalProps) => {
    const [size, setSize] = useState<GameModalSize>({size: 'large'});
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
            case 'small': return { width: 400, bodyStyle: { height: '30vh' } };
            case 'large': return { width: 800, bodyStyle: { height: '70vh' } };
            default: return { width: 600, bodyStyle: { height: '50vh' } };
        }
    };

    return (
        <>
            <Modal
                width={getModalSize().width}
                bodyStyle={getModalSize().bodyStyle}
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
                <Button onClick={onSmallSizeButtonClick}>Small Size</Button>
                <Button onClick={onMediumSizeButtonClick}>Medium Size</Button>
                <Button onClick={onLargeSizeButtonClick}>Large Size</Button>
            </Modal>
        </>
    );
}

export default GameModal;