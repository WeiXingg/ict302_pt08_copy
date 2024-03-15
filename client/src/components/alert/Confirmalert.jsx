import React from "react"
import "./confirmalert.css"

const ConfirmAlert = ({ message, onClose, onConfirm }) => {
    return (
        <div>
            <div className="confirm-alert-overlay"></div>
            <div className="confirm-alert">
                <p>{message}</p>
                <div className="caButtonContainer">
                    <button onClick={onClose}>No</button>
                    <button onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAlert;