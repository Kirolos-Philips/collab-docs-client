import React from 'react';
import s from './Logo.module.css';

/**
 * Shared Logo component for consistent branding across the app.
 * @param {string} size - The size of the logo icon (default: 'sm')
 * @param {boolean} showText - Whether to show the "Sync" text alongside logo
 * @param {string} className - Optional container className override
 */
const Logo = ({ size = 'sm', showText = true, className = '' }) => {
    return (
        <div className={`${s.logoContainer} ${s[size]} ${className}`}>
            <img src="/logo.png" alt="Sync Logo" className={s.logoImg} />
            {showText && <span className={s.logoText}>Sync</span>}
        </div>
    );
};

export default Logo;
