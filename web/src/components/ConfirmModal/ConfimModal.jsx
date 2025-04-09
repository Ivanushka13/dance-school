import React from "react"
import "./ConfirmModal.css"

const ConfirmModal = ({open, onClose, text, loaded}) => {

    if (!open) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="modalContainer">
                <div className="content">
                    {text}
                </div>
                <div className="btnContainer">
                    <button className="btnOutline" onClick={onClose}>
                        <span className="bold">Отменить</span>
                    </button>
                    <button className="btnPrimary"
                            onClick={() => {
                                onClose();
                                loaded();
                            }}>
                        <span className="bold">Подтвердить</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;