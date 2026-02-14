import React from 'react';
import { ArrowLeft, Cloud, Users, Loader2 } from 'lucide-react';
import s from '../Editor.module.css';

const EditorHeader = ({
  title,
  handleTitleChange,
  handleTitleBlur,
  handleTitleKeyDown,
  isSaving,
  isConnected,
  activeUsers,
  navigate,
  t,
}) => {
  const usersArray = Array.from(activeUsers.values());
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
                key={i}
                className={s.avatarItem}
                style={{
                  borderColor: u.color || 'var(--primary)',
                  zIndex: visibleUsers.length - i,
                }}
                title={u.username}
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
