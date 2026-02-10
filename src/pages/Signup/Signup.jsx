import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import API from '../../api/client';
import Logo from '../../components/Logo/Logo';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
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
        <AuthLayout
            title="Create Account"
            subtitle="Join our collaborative editing community"
            footer={<>Already have an account? <Link to="/login">Login</Link></>}
        >
            <div className={s.logoIcon}>
                <Logo size="lg" showText={false} />
            </div>

            <form onSubmit={handleSubmit}>
                {error && <div className={s.authError}>{error}</div>}

                <InputField
                    id="username"
                    label="Username"
                    icon={User}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                />

                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                />

                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <Button
                    type="submit"
                    loading={loading}
                    className={s.submitBtn}
                >
                    Create Account
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Signup;
