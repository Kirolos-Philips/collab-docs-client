import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User } from 'lucide-react';
import API from '../../api/client';
import Logo from '../../components/Logo/Logo';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import s from './Signup.module.css';

const Signup = () => {
  const { t } = useTranslation();
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
      const response = await API.post('/auth/register', { username, email, password });
      navigate('/verify-email', {
        state: {
          email,
          message: response.message || t('auth.otpSent'),
        },
      });
    } catch (err) {
      setError(err.message || t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.createAccount')}
      subtitle={t('auth.joinCommunity')}
      footer={
        <>
          {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.login')}</Link>
        </>
      }
    >
      <div className={s.logoIcon}>
        <Logo size="lg" showText={false} />
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className={s.authError}>{error}</div>}

        <InputField
          id="username"
          label={t('auth.username')}
          icon={User}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
          required
        />

        <InputField
          id="email"
          label={t('auth.email')}
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />

        <InputField
          id="password"
          label={t('auth.password')}
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" loading={loading} className={s.submitBtn}>
          {t('auth.signup')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
