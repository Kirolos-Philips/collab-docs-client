import React, { useEffect } from 'react';
import s from './Toast.module.css';

const Toast = ({ notification, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (notification && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose, duration]);

  if (!notification) return null;

  return (
    <div className={`${s.toast} ${s[notification.type]}`}>
      {notification.message}
      <button className={s.closeBtn} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
