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

  // Document state
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Collaboration Hook
  const { content, updateContent, activeUsers, isConnected } = useCollaboration(id);

  const fetchDocument = useCallback(async () => {
    try {
      const data = await API.get(`/documents/${id}/`);
      setTitle(data.title);
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

  const handleContentChange = (e) => {
    updateContent(e.target.value);
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
      <EditorHeader
        title={title}
        handleTitleChange={handleTitleChange}
        handleTitleBlur={handleTitleBlur}
        handleTitleKeyDown={handleTitleKeyDown}
        isSaving={isSaving}
        isConnected={isConnected}
        activeUsersCount={activeUsers.size}
        navigate={navigate}
        t={t}
      />

      <EditorTextArea content={content} handleContentChange={handleContentChange} t={t} />
    </div>
  );
};

export default Editor;
