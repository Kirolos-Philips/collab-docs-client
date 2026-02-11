import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, Settings, User } from 'lucide-react';
import Logo from '../Logo/Logo';
import Dropdown from '../Dropdown/Dropdown';
import ProfileModal from '../ProfileModal/ProfileModal';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import s from './Navbar.module.css';

const Navbar = ({ user, logout }) => {
    const { t } = useTranslation();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <nav className={s.navbar}>
            <Logo size="sm" />
            <div className={s.navRight}>
                <LanguageSwitcher />
                <div className={s.userNav}>
                    <Dropdown
                        trigger={
                            <div className={s.userInfoStack}>
                                <div className={s.avatar}>
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="avatar" />
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=random&rounded=true&bold=true`} alt="avatar" />
                                    )}
                                </div>
                                <div className={s.userText}>
                                    <span className={s.name}>{user?.username}</span>
                                    <span className={s.email}>{user?.email || `${user?.username}@sync.com`}</span>
                                </div>
                            </div>
                        }
                    >
                        <Dropdown.Item icon={Settings} onClick={() => setShowProfile(true)}>
                            {t('auth.profileSettings', { defaultValue: 'Profile Settings' })}
                        </Dropdown.Item>
                        <Dropdown.Item icon={LogOut} variant="danger" onClick={logout}>
                            {t('auth.logout')}
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>

            <ProfileModal
                show={showProfile}
                onClose={() => setShowProfile(false)}
            />
        </nav>
    );
};

export default Navbar;
