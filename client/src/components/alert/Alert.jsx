import React from 'react'
import './alert.css'

const CustomAlert = ({ message, onClose }) => {
    return (
        <div>
            <div className="custom-alert-overlay"></div>
            <div className="custom-alert">
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default CustomAlert;