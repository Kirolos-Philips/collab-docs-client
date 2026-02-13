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
  activeUsersCount,
  navigate,
  t,
}) => {
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
          <Users size={20} color={activeUsersCount > 1 ? 'var(--primary)' : 'var(--text-muted)'} />
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
