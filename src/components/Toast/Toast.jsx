import React from 'react';
import './Toast.css';

const Toast = ({ notification }) => {
    if (!notification) return null;

    return (
        <div className={`toast ${notification.type}`}>
            {notification.message}
        </div>
    );
};

export default Toast;
