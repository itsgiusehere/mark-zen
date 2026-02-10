import { useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';

const STORAGE_KEY = 'md-editor-scratchpad';

export function useEditorPersistence() {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const saveStatusRef = useRef<(status: string) => void>();

  const loadContent = useCallback((): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }, []);

  const saveContent = useCallback((editor: Editor) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveStatusRef.current?.('Saving…');
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const html = editor.getHTML();
        // If editor is empty, clear storage
        if (editor.isEmpty) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, html);
        }
        saveStatusRef.current?.('Saved');
      } catch {
        saveStatusRef.current?.('Error');
      }
    }, 300);
  }, []);

  const clearContent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setSaveStatusCallback = useCallback((cb: (status: string) => void) => {
    saveStatusRef.current = cb;
  }, []);

  return { loadContent, saveContent, clearContent, setSaveStatusCallback };
}
