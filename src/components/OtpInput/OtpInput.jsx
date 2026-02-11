import React, { useRef, useState } from 'react';
import s from './OtpInput.module.css';

const OtpInput = ({ length = 6, value, onChange }) => {
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newValue = value.split('');
        newValue[index] = val.substring(val.length - 1);
        const combinedValue = newValue.join('');
        onChange(combinedValue);

        if (val && index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData('text').slice(0, length);
        if (isNaN(data)) return;
        onChange(data);
        if (data.length === length) {
            inputs.current[length - 1].focus();
        }
    };

    return (
        <div className={s.otpContainer}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    type="text"
                    ref={(el) => (inputs.current[index] = el)}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={s.otpBox}
                    maxLength={1}
                />
            ))}
        </div>
    );
};

export default OtpInput;
