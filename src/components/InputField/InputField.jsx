import React from 'react';
import s from './InputField.module.css';

/**
 * Shared InputField component for all forms.
 */
const InputField = ({ label, icon: Icon, id, type = 'text', error, className = '', ...props }) => {
  return (
    <div className={`${s.inputGroup} ${className}`}>
      {label && (
        <label className={s.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`${s.inputWithIcon} ${Icon ? s.hasIcon : ''}`}>
        {Icon && (
          <div className={s.iconWrapper}>
            <Icon size={18} />
          </div>
        )}
        <input id={id} type={type} className={error ? s.inputError : ''} {...props} />
      </div>
      {error && <span className={s.errorText}>{error}</span>}
    </div>
  );
};

export default InputField;
