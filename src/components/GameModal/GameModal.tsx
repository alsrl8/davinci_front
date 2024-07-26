import {Modal} from "antd";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable';
import {useState} from "react";

interface GameModalProps {
    isModalOpen: boolean;
}

interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

const GameModal = (props: GameModalProps) => {
    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState<Bounds>({left: 0, top: 0, right: 0, bottom: 0});


    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };


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
                        style={{
                            height: '20px',
                            width: '100%',
                            cursor: 'move',
                        }}
                        onMouseOver={() => setDisabled(false)}
                        onMouseOut={() => setDisabled(true)}
                        onMouseDown={() => setDisabled(true)} // Fix for cursor flickering issue
                    >
                    </div>
                }
                open={props.isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                modalRender={(modal) => (
                    <Draggable disabled={disabled} bounds={bounds} onStart={onStart}>
                        <div>{modal}</div>
                    </Draggable>
                )}
            >
                <p>Modal content can go here...</p>
            </Modal>
        </>
    );
}

export default GameModal;