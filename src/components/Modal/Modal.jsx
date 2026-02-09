import React from 'react';
import s from './Modal.module.css';

const Modal = ({ show, title, children, onClose }) => {
    if (!show) return null;

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modalCard} onClick={(e) => e.stopPropagation()}>
                {title && <h3>{title}</h3>}
                {children}
            </div>
        </div>
    );
};

export default Modal;
