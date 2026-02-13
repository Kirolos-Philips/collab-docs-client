import React from 'react';
import s from '../Editor.module.css';

const EditorTextArea = ({ content, handleContentChange, t }) => {
  return (
    <main className={s.contentArea}>
      <div className={s.editorContainer}>
        <textarea
          className={s.textarea}
          placeholder={t('editor.startTyping', {
            defaultValue: 'Start typing...',
          })}
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </main>
  );
};

export default EditorTextArea;
