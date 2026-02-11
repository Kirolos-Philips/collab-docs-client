import React from 'react';
import { Loader2 } from 'lucide-react';
import s from './Button.module.css';

/**
 * Universal Button component.
 * @param {string} variant - 'primary', 'secondary', 'danger', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} loading - show spinner and disable
 * @param {React.ReactNode} icon - optional icon before text
 */
const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    onClick,
    className = '',
    square = false,
    ...props
}) => {
    return (
        <button
            type={type}
            className={`${s.btn} ${s[variant]} ${s[size]} ${square ? s.square : ''} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <Loader2 className={s.spinner} size={size === 'sm' ? 16 : 20} />
            ) : (
                <>
                    {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
