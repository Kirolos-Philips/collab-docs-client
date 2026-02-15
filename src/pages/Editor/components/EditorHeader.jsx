import React, { useState } from 'react';
import { ArrowLeft, Cloud, Users, Loader2 } from 'lucide-react';
import API from '../../../api/client';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import s from '../Editor.module.css';

const EditorHeader = ({ id, initialTitle, isConnected, activeUsers, navigate, t }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currentUserId = user?.id || user?._id;

  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await API.patch(`/documents/${id}/`, { title: title.trim() });
    } catch (error) {
      console.error('Failed to update title:', error);
      showToast(t('dashboard.failedToUpdate', { defaultValue: 'Failed to update title' }), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const usersArray = Array.from(activeUsers.entries())
    .map(([id, data]) => ({
      id,
      ...data,
      isMe: id === currentUserId,
    }))
    .sort((a, b) => (a.isMe ? 1 : -1));

  const maxVisible = 3;
  const visibleUsers = usersArray.slice(0, maxVisible);
  const remainingCount = usersArray.length - maxVisible;

  return (
    <header className={s.header}>
      <div className={s.headerLeft}>
        <button
          className={s.backBtn}
          onClick={() => navigate('/')}
          title={t('common.back', { defaultValue: 'Back' })}
        >
          <ArrowLeft size={20} />
        </button>
        <div className={s.titleContainer}>
          <input
            className={s.docTitle}
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder={t('dashboard.docTitle')}
          />
        </div>
      </div>

      <div className={s.headerRight}>
        <div className={s.syncStatus}>
          {isSaving || !isConnected ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>
                {isConnected
                  ? t('editor.saving', { defaultValue: 'Saving...' })
                  : t('editor.connecting', { defaultValue: 'Connecting...' })}
              </span>
            </>
          ) : (
            <>
              <Cloud size={18} />
              <span>{t('editor.saved', { defaultValue: 'Saved' })}</span>
            </>
          )}
        </div>

        <div className={s.collaboration}>
          <div className={s.avatarList}>
            {visibleUsers.map((u, i) => (
              <div
                key={u.id || i}
                className={`${s.avatarItem} ${u.isMe ? s.currentUserAvatar : ''}`}
                style={{
                  borderColor: u.color || 'var(--primary)',
                  zIndex: visibleUsers.length - i,
                }}
                title={
                  u.isMe
                    ? `${u.username} (${t('common.you', { defaultValue: 'You' })})`
                    : u.username
                }
              >
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.username} />
                ) : (
                  <span>{u.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            ))}
            {remainingCount > 0 && <div className={s.avatarMore}>+{remainingCount}</div>}
            {usersArray.length === 0 && <Users size={20} color="var(--text-muted)" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
