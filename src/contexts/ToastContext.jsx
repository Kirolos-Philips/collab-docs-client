import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setNotification({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Toast
                notification={notification}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
