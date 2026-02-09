import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, Mail, Lock, User } from 'lucide-react';
import API from '../../api/client';
import styles from './Signup.module.css';

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
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <div className={styles.logoIcon}>
                        <UserPlus size={28} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join our collaborative editing community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.authError}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <div className={styles.inputWithIcon}>
                            <User className={styles.icon} size={18} />
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

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <div className={styles.inputWithIcon}>
                            <Mail className={styles.icon} size={18} />
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

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputWithIcon}>
                            <Lock className={styles.icon} size={18} />
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

                    <button type="submit" className={styles.authBtn} disabled={loading}>
                        {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Create Account'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
