import React from 'react';
import s from './InputField.module.css';

/**
 * Shared InputField component for all forms.
 */
const InputField = ({
    label,
    icon: Icon,
    id,
    type = 'text',
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`${s.inputGroup} ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <div className={`${s.inputWithIcon} ${Icon ? s.hasIcon : ''}`}>
                {Icon && <Icon className={s.icon} size={18} />}
                <input
                    id={id}
                    type={type}
                    className={error ? s.inputError : ''}
                    {...props}
                />
            </div>
            {error && <span className={s.errorText}>{error}</span>}
        </div>
    );
};

export default InputField;
