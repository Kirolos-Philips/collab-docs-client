import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../api/client';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import Button from '../../components/Button/Button';
import OtpInput from '../../components/OtpInput/OtpInput';
import { useToast } from '../../contexts/ToastContext';
import s from './VerifyEmail.module.css';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Try to get email and initial message from navigation state
        if (location.state?.email) {
            setEmail(location.state.email);
            if (location.state.message) {
                setSuccessMessage(location.state.message);
            }
        } else {
            // Fallback or redirect if no email
            setError('Email not found. Please try signing up again.');
        }
    }, [location]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const response = await API.post('/auth/verify-email', { email, otp });
            showToast(response.message || 'Email verified successfully!', 'success');

            // Short delay before redirecting
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            setError(err.message || 'Verification failed. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sync"
            subtitle="One last step."
            footer={
                <div className={s.resendText}>
                    Didn't receive a code? <button className={s.resendBtn} onClick={() => {/* Resend logic */ }}>Resend</button>
                </div>
            }
        >
            <div className={s.placeholder} /> {/* This fills children[0] slot in AuthLayout */}

            <div className={s.content}>
                <p className={s.instruction}>
                    Enter the 6-digit code sent to your email.
                </p>

                <form onSubmit={handleVerify}>
                    {error && <div className={s.errorMsg}>{error}</div>}

                    <div className={s.inputWrapper}>
                        <label className={s.label}>Verification Code</label>
                        <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className={s.verifyBtn}
                    >
                        Verify & Sign In
                    </Button>
                </form>

                {successMessage && (
                    <div className={s.successToast}>
                        {successMessage}
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;
