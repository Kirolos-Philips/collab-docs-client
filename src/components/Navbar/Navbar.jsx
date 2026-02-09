import React from 'react';
import './Navbar.css';

const Navbar = ({ user, logout }) => {
    return (
        <nav className="navbar">
            <div className="brand">Sync</div>
            <div className="user-nav">
                <div className="user-info-stack">
                    <div className="avatar">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="avatar" />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=random&rounded=true&bold=true`} alt="avatar" />
                        )}
                    </div>
                    <div className="user-text">
                        <span className="name">{user?.username}</span>
                        <span className="email">{user?.email || `${user?.username}@sync.com`}</span>
                    </div>
                </div>
                <button onClick={logout} className="nav-logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
