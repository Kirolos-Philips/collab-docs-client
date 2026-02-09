import React from 'react';
import s from './Toast.module.css';

const Toast = ({ notification }) => {
    if (!notification) return null;

    return (
        <div className={`${s.toast} ${s[notification.type]}`}>
            {notification.message}
        </div>
    );
};

export default Toast;
