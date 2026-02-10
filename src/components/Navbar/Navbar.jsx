import Logo from '../Logo/Logo';
import s from './Navbar.module.css';

const Navbar = ({ user, logout }) => {
    return (
        <nav className={s.navbar}>
            <Logo size="sm" />
            <div className={s.userNav}>
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
                <button onClick={logout} className={s.navLogoutBtn}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
