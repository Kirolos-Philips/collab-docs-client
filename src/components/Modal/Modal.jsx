import React from 'react';
import s from './Modal.module.css';

const Modal = ({ show, title, children, onClose }) => {
    if (!show) return null;

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modalCard} onClick={(e) => e.stopPropagation()}>
                {title && <h3 className={s.modalTitle}>{title}</h3>}
                <div className={s.modalContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

Modal.Actions = ({ children, className = '' }) => {
    return (
        <div className={`${s.modalActions} ${className}`}>
            {children}
        </div>
    );
};

export default Modal;
