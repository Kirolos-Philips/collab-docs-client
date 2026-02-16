import React, { useRef, useEffect } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { yCollab } from 'y-codemirror.next';
import s from '../Editor.module.css';

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '1.1rem',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    padding: '40px',
  },
  '.cm-content': {
    caretColor: 'var(--text-main)',
    padding: '0',
  },
  '.cm-focused': {
    outline: 'none',
  },
  '.cm-line': {
    padding: '0',
  },
  '.cm-activeLine': {
    backgroundColor: 'transparent',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
  },
  '@media (max-width: 768px)': {
    '.cm-scroller': {
      padding: '24px',
    },
  },
  '@media (max-width: 480px)': {
    '&': {
      fontSize: '1rem',
    },
    '.cm-scroller': {
      padding: '16px',
    },
  },
});

const EditorTextArea = ({ ytext, awareness, t }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current || !ytext || !awareness) return;

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        editorTheme,
        yCollab(ytext, awareness), // Pass awareness for cursor rendering
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [ytext, awareness]);

  return (
    <main className={s.contentArea}>
      <div className={s.editorContainer}>
        <div ref={editorRef} className={s.textarea} />
      </div>
    </main>
  );
};

export default EditorTextArea;
