import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useEditorPersistence } from '@/hooks/useEditorPersistence';
import EditorFooter from './EditorFooter';
import DropOverlay from './DropOverlay';

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const MarkdownEditor = () => {
  const { loadContent, saveContent, clearContent, setSaveStatusCallback } = useEditorPersistence();
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [fileName, setFileName] = useState<string>();
  const [lastModified, setLastModified] = useState<string>();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    setSaveStatusCallback(setSaveStatus);
  }, [setSaveStatusCallback]);

  const updateStats = useCallback((text: string) => {
    setWordCount(countWords(text));
    setCharCount(text.length);
  }, []);

  const scrollCursorToCenter = useCallback((editor: any) => {
    requestAnimationFrame(() => {
      const { view } = editor;
      const coords = view.coordsAtPos(view.state.selection.head);
      const editorRect = view.dom.getBoundingClientRect();
      // Only scroll if cursor is in lower 40% of viewport
      const viewportThreshold = window.innerHeight * 0.6;
      if (coords.top > viewportThreshold) {
        const targetY = window.scrollY + coords.top - window.innerHeight * 0.35;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: { HTMLAttributes: { class: '' } },
      }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    autofocus: true,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      updateStats(text);
      saveContent(editor);
      scrollCursorToCenter(editor);
    },
    onCreate: ({ editor }) => {
      const cached = loadContent();
      if (cached) {
        editor.commands.setContent(cached);
        const text = editor.getText();
        updateStats(text);
      }
      setSaveStatus('Saved');
    },
  });

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files.length) return;

    const file = files[0];
    
    if (!file.name.endsWith('.md')) {
      alert('Please upload a markdown file (.md)');
      return;
    }

    // Check if editor has content
    if (editor && !editor.isEmpty) {
      const proceed = window.confirm('Current content will be lost. Do you want to proceed?');
      if (!proceed) return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (editor) {
        // Clear cache first
        clearContent();
        
        // Set raw text as paragraphs (since it's markdown source)
        // TipTap will render it as plain text, which is fine for a prototype
        const html = text
          .split('\n')
          .map(line => `<p>${line || '<br>'}</p>`)
          .join('');
        
        editor.commands.setContent(html);
        updateStats(editor.getText());
        
        setFileName(file.name);
        setLastModified(new Date(file.lastModified).toLocaleString());
        setSaveStatus('Saved');

        // Save the new content
        saveContent(editor);
      }
    };
    reader.readAsText(file);
  }, [editor, clearContent, updateStats, saveContent]);

  return (
    <div
      className="tiptap-editor min-h-screen bg-[hsl(var(--editor-bg))]"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DropOverlay visible={isDragOver} />
      <EditorContent editor={editor} />
      <EditorFooter
        wordCount={wordCount}
        charCount={charCount}
        saveStatus={saveStatus}
        fileName={fileName}
        lastModified={lastModified}
      />
    </div>
  );
};

export default MarkdownEditor;
