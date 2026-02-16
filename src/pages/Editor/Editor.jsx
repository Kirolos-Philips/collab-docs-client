import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { useCollaboration } from './hooks/useCollaboration';
import EditorHeader from './components/EditorHeader';
import EditorTextArea from './components/EditorTextArea';
import s from './Editor.module.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [initialTitle, setInitialTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Collaboration Hook
  const { ytext, awareness, activeUsers, isConnected } = useCollaboration(id);

  const fetchDocument = useCallback(async () => {
    try {
      const data = await API.get(`/documents/${id}/`);
      setInitialTitle(data.title);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch document:', error);
      showToast(t('common.error', { defaultValue: 'Something went wrong' }), 'error');
      navigate('/');
    }
  }, [id, navigate, showToast, t]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className={s.editorPage}>
      <EditorHeader
        id={id}
        initialTitle={initialTitle}
        isConnected={isConnected}
        activeUsers={activeUsers}
        navigate={navigate}
        t={t}
      />

      <EditorTextArea ytext={ytext} awareness={awareness} t={t} />
    </div>
  );
};

export default Editor;
