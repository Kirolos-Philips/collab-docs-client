import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import s from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            className={s.switcherBtn}
            onClick={toggleLanguage}
            title={i18n.language === 'en' ? 'تغيير اللغة إلى العربية' : 'Change language to English'}
        >
            <Languages size={20} />
            <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
        </button>
    );
};

export default LanguageSwitcher;
