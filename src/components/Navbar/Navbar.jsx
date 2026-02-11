import React, { useState } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import Logo from '../Logo/Logo';
import Dropdown from '../Dropdown/Dropdown';
import ProfileModal from '../ProfileModal/ProfileModal';
import s from './Navbar.module.css';

const Navbar = ({ user, logout }) => {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <nav className={s.navbar}>
            <Logo size="sm" />
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
                        Profile Settings
                    </Dropdown.Item>
                    <Dropdown.Item icon={LogOut} variant="danger" onClick={logout}>
                        Logout
                    </Dropdown.Item>
                </Dropdown>
            </div>

            <ProfileModal
                show={showProfile}
                onClose={() => setShowProfile(false)}
            />
        </nav>
    );
};

export default Navbar;
