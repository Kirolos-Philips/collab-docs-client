import React from 'react';
import s from './AuthLayout.module.css';

/**
 * Higher-order component/Wrapper for Authentication pages.
 */
const AuthLayout = ({ children, title, subtitle, footer }) => {
  return (
    <div className={s.authContainer}>
      <div className={s.authCard}>
        <div className={s.authHeader}>
          {children[0]} {/* Expected: Logo wrapper or similar */}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {children.slice(1)}

        {footer && <div className={s.authFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default AuthLayout;
