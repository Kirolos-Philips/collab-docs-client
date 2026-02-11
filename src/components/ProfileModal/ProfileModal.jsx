import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Camera, Loader2, X } from 'lucide-react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import API from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import s from './ProfileModal.module.css';

const ProfileModal = ({ show, onClose }) => {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await API.updateProfile({ username, email });
      await refreshUser();
      showToast(t('profile.profileUpdated'));
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || t('profile.failedToUpdate'));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await API.uploadAvatar(file);
      await refreshUser();
    } catch (err) {
      setError(err.message || t('profile.failedToUploadAvatar'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} title={t('profile.editProfile')} onClose={onClose}>
      <div className={s.profileContainer}>
        <div className={s.avatarSection}>
          <div className={s.avatarWrapper}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className={s.avatarImg} />
            ) : (
              <div className={s.avatarPlaceholder}>
                <User size={40} />
              </div>
            )}
            <label className={s.avatarUploadLabel}>
              {uploading ? <Loader2 className={s.spinner} /> : <Camera size={20} />}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                className={s.hiddenInput}
              />
            </label>
          </div>
          <p className={s.avatarHint}>{t('profile.clickToChangeAvatar')}</p>
        </div>

        <form onSubmit={handleSubmit} className={s.form}>
          <InputField
            label={t('profile.username')}
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputField
            label={t('profile.emailAddress')}
            icon={Mail}
            type="email"
            value={email}
            disabled
          />

          {error && <p className={s.errorMsg}>{error}</p>}

          <Modal.Actions>
            <Button variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {t('profile.saveChanges')}
            </Button>
          </Modal.Actions>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileModal;
