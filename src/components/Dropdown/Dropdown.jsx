import React, { useState, useRef, useEffect } from 'react';
import s from './Dropdown.module.css';

/**
 * Reusable Dropdown menu component.
 */
const Dropdown = ({ trigger, children, align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={s.dropdown} ref={dropdownRef}>
            <div className={s.trigger} onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
            }}>
                {trigger}
            </div>

            {isOpen && (
                <div className={`${s.menu} ${s[align]}`} onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            )}
        </div>
    );
};

Dropdown.Item = ({ children, onClick, variant = 'default', icon: Icon }) => {
    return (
        <button
            className={`${s.menuItem} ${s[variant]}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(e);
            }}
        >
            {Icon && <Icon size={16} />}
            {children}
        </button>
    );
};

export default Dropdown;
