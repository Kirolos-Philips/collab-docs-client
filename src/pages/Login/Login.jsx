import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/Logo/Logo';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
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
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your credentials to access your documents"
            footer={<>Don't have an account? <Link to="/signup">Sign up</Link></>}
        >
            <div className={s.logoIcon}>
                <Logo size="lg" showText={false} />
            </div>

            <form onSubmit={handleSubmit}>
                {error && <div className={s.authError}>{error}</div>}

                <InputField
                    id="username"
                    label="Username"
                    icon={Mail}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
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
                    Login
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;
