import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Extension } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { useState, useCallback, useRef } from 'react';
import { useEditorPersistence } from '@/hooks/useEditorPersistence';
import EditorFooter from './EditorFooter';
import DropOverlay from './DropOverlay';

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

// Custom extension to exit headings on Enter
const EnterAfterHeading = Extension.create({
  name: 'enterAfterHeading',
  priority: 1000, // Higher priority than default handlers

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        const { parent } = $from;

        // Check if we're in a heading
        if (parent.type.name === 'heading') {
          const cursorOffset = $from.parentOffset;
          const textContent = parent.textContent;

          // At the beginning - insert paragraph before and move heading down
          if (cursorOffset === 0) {
            return editor.commands.command(({ tr }) => {
              const headingPos = $from.before();
              const para = state.schema.nodes.paragraph.create();
              tr.insert(headingPos, para);

              // The heading has moved down by the size of the inserted paragraph
              // Calculate new position: after the paragraph we just inserted
              const newCursorPos = headingPos + para.nodeSize;
              const $pos = tr.doc.resolve(newCursorPos);
              tr.setSelection(TextSelection.near($pos));

              return true;
            });
          }

          // In the middle or at the end - split and convert second part to paragraph
          const afterCursor = textContent.slice(cursorOffset);

          return editor.commands.command(({ tr }) => {
            const afterHeadingPos = $from.after();

            // If there's text after cursor, move it to new paragraph
            if (afterCursor) {
              tr.delete($from.pos, $from.end());

              const para = state.schema.nodes.paragraph.create(null, state.schema.text(afterCursor));
              tr.insert(afterHeadingPos, para);

              const $pos = tr.doc.resolve(afterHeadingPos + 1);
              tr.setSelection(TextSelection.near($pos));
            } else {
              // Just insert empty paragraph after heading
              const para = state.schema.nodes.paragraph.create();
              tr.insert(afterHeadingPos, para);

              const $pos = tr.doc.resolve(afterHeadingPos + 1);
              tr.setSelection(TextSelection.near($pos));
            }

            return true;
          });
        }

        return false;
      },
    };
  },
});

// Custom extension to exit code blocks with ```
const ExitCodeBlock = Extension.create({
  name: 'exitCodeBlock',

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        const { parent } = $from;

        // Check if we're in a code block
        if (parent.type.name === 'codeBlock') {
          const text = parent.textContent;

          // Get the current line (text from last newline to cursor)
          const textBeforeCursor = text.slice(0, $from.parentOffset);
          const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
          const currentLine = lastNewlineIndex === -1
            ? textBeforeCursor
            : textBeforeCursor.slice(lastNewlineIndex + 1);

          // If current line is ``` (user typed ``` and pressed Enter)
          if (currentLine.trim() === '```') {
            // Calculate position where ``` starts
            const backticksStartPos = $from.parentOffset - currentLine.length;
            const contentBeforeBackticks = text.slice(0, backticksStartPos).trimEnd();
            const start = $from.start();

            if (contentBeforeBackticks) {
              // If there's content, keep it and exit
              editor.chain()
                .command(({ tr }) => {
                  tr.replaceWith(start, start + text.length, state.schema.text(contentBeforeBackticks));
                  return true;
                })
                .exitCode()
                .insertContent({ type: 'paragraph' })
                .run();
            } else {
              // If only ```, just exit the empty code block
              editor.chain()
                .deleteNode('codeBlock')
                .insertContent({ type: 'paragraph' })
                .run();
            }

            return true;
          }
        }

        return false;
      },
    };
  },
});

const MarkdownEditor = () => {
  const { loadContent, saveContent, clearContent } = useEditorPersistence();
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [fileName, setFileName] = useState<string>();
  const [lastModified, setLastModified] = useState<string>();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

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
        code: {}, // Enable inline code with input rules
      }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      EnterAfterHeading,
      ExitCodeBlock,
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
    
    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      alert('Please upload a markdown (.md) or text (.txt) file');
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
        fileName={fileName}
        lastModified={lastModified}
      />
    </div>
  );
};

export default MarkdownEditor;
