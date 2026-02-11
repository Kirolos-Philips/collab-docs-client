import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Cloud, Users } from 'lucide-react';
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
            <h1 className={s.docTitle}>{title}</h1>
          </div>
        </div>

        <div className={s.headerRight}>
          <div className={s.syncStatus}>
            <Cloud size={18} className={s.syncIcon} />
            <span>{t('editor.saved', { defaultValue: 'Saved' })}</span>
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
