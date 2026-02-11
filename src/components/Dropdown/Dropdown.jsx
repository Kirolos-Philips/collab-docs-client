import React, { useState, useRef, useEffect } from 'react';
import s from './Dropdown.module.css';

const DropdownContext = React.createContext();

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

  const toggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <DropdownContext.Provider value={{ setIsOpen }}>
      <div className={s.dropdown} ref={dropdownRef}>
        <div className={s.trigger} onClick={toggle}>
          {trigger}
        </div>

        {isOpen && (
          <div className={`${s.menu} ${s[align]}`} onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

Dropdown.Item = ({ children, onClick, variant = 'default', icon: Icon }) => {
  const { setIsOpen } = React.useContext(DropdownContext);

  return (
    <button
      className={`${s.menuItem} ${s[variant]}`}
      onClick={(e) => {
        e.stopPropagation();
        // Call onClick BEFORE closing to ensure event is handled while mounted
        if (onClick) onClick(e);
        setIsOpen(false);
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Dropdown;
