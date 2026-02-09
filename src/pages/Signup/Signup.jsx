import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, Mail, Lock, User } from 'lucide-react';
import API from '../../api/client';
import s from './Signup.module.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await API.post('/auth/signup', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.authContainer}>
            <div className={s.authCard}>
                <div className={s.authHeader}>
                    <div className={s.logoIcon}>
                        <UserPlus size={28} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join our collaborative editing community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={s.authError}>{error}</div>}

                    <div className={s.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <div className={s.inputWithIcon}>
                            <User className={s.icon} size={18} />
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
                        <label htmlFor="email">Email</label>
                        <div className={s.inputWithIcon}>
                            <Mail className={s.icon} size={18} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
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
                        {loading ? <Loader2 className={s.spinner} size={20} /> : 'Create Account'}
                    </button>
                </form>

                <div className={s.authFooter}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
