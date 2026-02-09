import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import s from './Login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.authContainer}>
            <div className={s.authCard}>
                <div className={s.authHeader}>
                    <div className={s.logoIcon}>
                        <LogIn size={28} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access your documents</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={s.authError}>{error}</div>}

                    <div className={s.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <div className={s.inputWithIcon}>
                            <Mail className={s.icon} size={18} />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>

                    <div className={s.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={s.inputWithIcon}>
                            <Lock className={s.icon} size={18} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={s.authBtn} disabled={loading}>
                        {loading ? <Loader2 className={s.spinner} size={20} /> : 'Login'}
                    </button>
                </form>

                <div className={s.authFooter}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
