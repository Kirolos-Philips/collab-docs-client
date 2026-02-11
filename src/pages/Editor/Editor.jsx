import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Cloud, Users, Loader2 } from 'lucide-react';
import API from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import s from './Editor.module.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const data = await API.get(`/documents/${id}`);
      setTitle(data.title);
      // Content will be handled by Yjs later, but for now we might have local content
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch document:', error);
      showToast(t('common.error', { defaultValue: 'Something went wrong' }), 'error');
      navigate('/');
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await API.patch(`/documents/${id}`, { title: title.trim() });
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

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className={s.editorPage}>
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
            {isSaving ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>{t('editor.saving', { defaultValue: 'Saving...' })}</span>
              </>
            ) : (
              <>
                <Cloud size={18} />
                <span>{t('editor.saved', { defaultValue: 'Saved' })}</span>
              </>
            )}
          </div>

          <div className={s.collaboration}>
            {/* Avatar placeholders will go here */}
            <Users size={20} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      <main className={s.contentArea}>
        <div className={s.editorContainer}>
          <textarea
            className={s.textarea}
            placeholder={t('editor.startTyping', {
              defaultValue: 'Start typing...',
            })}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </main>
    </div>
  );
};

export default Editor;
