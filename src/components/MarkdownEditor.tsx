import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Extension } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { useState, useCallback, useRef, useEffect } from 'react';
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

// Custom extension: Cmd+K (link), Cmd+Shift+S (strikethrough), Cmd+Shift+H (highlight)
const FormattingShortcuts = Extension.create({
  name: 'formattingShortcuts',

  addKeyboardShortcuts() {
    return {
      'Mod-k': ({ editor }) => {
        const { empty } = editor.state.selection;
        if (empty) return false;
        const existingHref = editor.getAttributes('link').href ?? '';
        window.dispatchEvent(new CustomEvent('open-link-dialog', { detail: { existingHref } }));
        return true;
      },
      'Mod-Shift-s': ({ editor }) => editor.chain().focus().toggleStrike().run(),
      'Mod-Shift-h': ({ editor }) => editor.chain().focus().toggleHighlight().run(),
      'Mod-e': ({ editor }) => editor.chain().focus().toggleCode().run(),
    };
  },
});

// Custom extension: type "* " or "- " inside an indented ordered list item → convert to bullet
const BulletInOrderedList = Extension.create({
  name: 'bulletInOrderedList',

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;

        // Must be inside a listItem that's inside an orderedList
        const listItemDepth = $from.depth - 1;
        if (listItemDepth < 1) return false;

        const listItemNode = $from.node(listItemDepth);
        const parentListNode = $from.node(listItemDepth - 1);

        if (
          listItemNode?.type.name !== 'listItem' ||
          parentListNode?.type.name !== 'orderedList'
        ) return false;

        // Check the text before cursor in the current paragraph
        const textBefore = $from.parent.textBetween(0, $from.parentOffset);
        if (textBefore !== '*' && textBefore !== '-') return false;

        // Delete the * or - character, then toggle to bullet list
        return editor
          .chain()
          .deleteRange({ from: $from.pos - 1, to: $from.pos })
          .toggleBulletList()
          .run();
      },
    };
  },
});

// Custom extension: type "1 " inside an indented bullet list item → convert to ordered list
const OrderedInBulletList = Extension.create({
  name: 'orderedInBulletList',

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;

        // Must be inside a listItem that's inside a bulletList
        const listItemDepth = $from.depth - 1;
        if (listItemDepth < 1) return false;

        const listItemNode = $from.node(listItemDepth);
        const parentListNode = $from.node(listItemDepth - 1);

        if (
          listItemNode?.type.name !== 'listItem' ||
          parentListNode?.type.name !== 'bulletList'
        ) return false;

        const textBefore = $from.parent.textBetween(0, $from.parentOffset);
        if (textBefore !== '1.') return false;

        return editor
          .chain()
          .deleteRange({ from: $from.pos - 2, to: $from.pos })
          .toggleOrderedList()
          .run();
      },
    };
  },
});

// Custom extension: apply bold/italic when cursor leaves a **...** or *...* span.
// Tracks which span the cursor was inside, and applies formatting on exit.
// Also clears stored marks when a paragraph becomes empty (fixes bold-on-empty-line).
const InlineMarkdownFormat = Extension.create({
  name: 'inlineMarkdownFormat',

  addStorage() {
    return {
      activeSpan: null as { mark: 'bold' | 'italic' | 'strike' | 'highlight' | 'code' } | null,
    };
  },

  addKeyboardShortcuts() {
    return {
      // Intercept backspace to prevent the input-rule undo from firing.
      // When cursor is right after a bold/italic run, ProseMirror's undoInputRule
      // would partially revert the formatting to raw **text*. Instead, we let
      // the default backspace delete a single character normally.
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        // Only intercept if there are no stored marks and cursor is not in code
        if ($from.parent.type.name === 'codeBlock') return false;
        // If there's an active input rule to undo, swallow it by doing a plain delete
        const plugins = state.plugins;
        for (const plugin of plugins) {
          if ((plugin.spec as any).isInputRules && plugin.getState(state)) {
            // There's an input rule queued for undo — do a plain char delete instead
            const { from, to } = state.selection;
            if (from === to && from > 0) {
              editor.commands.command(({ tr }) => {
                tr.delete(from - 1, from);
                return true;
              });
              return true;
            }
          }
        }
        return false;
      },
    };
  },

  onSelectionUpdate() {
    const editor = this.editor;
    const { state } = editor;
    const { $from } = state.selection;

    if ($from.parent.type.name === 'codeBlock') {
      this.storage.activeSpan = null;
      return;
    }

    // Issue 2 fix: if the paragraph is empty and has stored marks, clear them.
    if ($from.parent.content.size === 0 && state.storedMarks?.length) {
      editor.commands.command(({ tr }) => {
        tr.setStoredMarks([]);
        return true;
      });
      return;
    }

    const parentStart = $from.start();
    const fullText = $from.parent.textContent;
    const cursorOffset = $from.parentOffset;

    type MarkName = 'bold' | 'italic' | 'strike' | 'highlight' | 'code';

    // Each entry: [regex to detect cursor-inside, regex to apply on exit, mark name]
    const spanRules: Array<{ detect: RegExp; apply: RegExp; mark: MarkName }> = [
      // bold: **text** or __text__
      { detect: /\*\*([^*\n]+)\*\*/g,     apply: /\*\*([^*\n]+)\*\*/,     mark: 'bold' },
      { detect: /__([^_\n]+)__/g,          apply: /__([^_\n]+)__/,          mark: 'bold' },
      // italic: *text* or _text_ (not preceded/followed by same char)
      { detect: /(?<!\*)\*([^*\n]+)\*(?!\*)/g, apply: /(?<!\*)\*([^*\n]+)\*(?!\*)/, mark: 'italic' },
      { detect: /(?<!_)_([^_\n]+)_(?!_)/g,     apply: /(?<!_)_([^_\n]+)_(?!_)/,     mark: 'italic' },
      // strikethrough: ~~text~~
      { detect: /~~([^~\n]+)~~/g,          apply: /~~([^~\n]+)~~/,          mark: 'strike' },
      // highlight: ==text==
      { detect: /==([^=\n]+)==/g,          apply: /==([^=\n]+)==/,          mark: 'highlight' },
      // inline code: `text`
      { detect: /`([^`\n]+)`/g,            apply: /`([^`\n]+)`/,            mark: 'code' },
    ];

    // Find which span (if any) the cursor is currently inside
    const findActiveSpan = (): { mark: MarkName } | null => {
      for (const rule of spanRules) {
        rule.detect.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = rule.detect.exec(fullText)) !== null) {
          const spanStart = m.index;
          const spanEnd = m.index + m[0].length;
          if (cursorOffset > spanStart && cursorOffset < spanEnd) {
            return { mark: rule.mark };
          }
        }
      }
      return null;
    };

    const current = findActiveSpan();

    if (current) {
      this.storage.activeSpan = { mark: current.mark };
    } else if (this.storage.activeSpan) {
      // Cursor just left a span — find the first matching pattern and apply formatting.
      const { mark } = this.storage.activeSpan;
      this.storage.activeSpan = null;

      const rule = spanRules.find(r => r.mark === mark);
      if (!rule) return;

      const m = rule.apply.exec(fullText);
      if (!m) return;

      const from = parentStart + m.index;
      const to = from + m[0].length;
      const inner = m[1];

      editor.chain()
        .command(({ tr, state: s }) => {
          const markType = s.schema.marks[mark];
          if (!markType) return false;
          tr.replaceWith(from, to, s.schema.text(inner, [markType.create()]));
          tr.setStoredMarks([]);
          return true;
        })
        .run();
    }
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
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);
  const [linkDialog, setLinkDialog] = useState<{ open: boolean; initialUrl: string }>({ open: false, initialUrl: '' });
  const [linkUrl, setLinkUrl] = useState('');
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { existingHref } = (e as CustomEvent).detail;
      setLinkUrl(existingHref);
      setLinkDialog({ open: true, initialUrl: existingHref });
      setTimeout(() => linkInputRef.current?.select(), 50);
    };
    window.addEventListener('open-link-dialog', handler);
    return () => window.removeEventListener('open-link-dialog', handler);
  }, []);

  const updateStats = useCallback((text: string) => {
    setWordCount(countWords(text));
    setCharCount(text.length);
  }, []);

  const scrollCursorToCenter = useCallback((editor: any) => {
    if (!editor.isEditable) return;
    requestAnimationFrame(() => {
      const { view } = editor;
      const coords = view.coordsAtPos(view.state.selection.head);
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
      Highlight.configure({ multicolor: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      EnterAfterHeading,
      ExitCodeBlock,
      InlineMarkdownFormat,
      FormattingShortcuts,
      BulletInOrderedList,
      OrderedInBulletList,
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

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().unsetMark('link').run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkDialog({ open: false, initialUrl: '' });
  }, [editor, linkUrl]);

  const cancelLink = useCallback(() => {
    setLinkDialog({ open: false, initialUrl: '' });
    editor?.commands.focus();
  }, [editor]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
      editor?.setEditable(false);
    }
  }, [editor]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
      editor?.setEditable(true);
    }
  }, [editor]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    editor?.setEditable(true);

    const files = e.dataTransfer.files;
    if (!files.length) return;

    const file = files[0];
    
    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      alert('Please upload a markdown (.md) or text (.txt) file');
      return;
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
      <div
        style={{
          opacity: isDragOver ? 0.7 : 1,
          pointerEvents: isDragOver ? 'none' : 'auto',
          transition: 'opacity 0.2s ease',
        }}
      >
        <EditorContent editor={editor} />
      </div>
      {linkDialog.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) cancelLink(); }}
        >
          <div
            style={{
              background: 'hsl(var(--footer-bg))',
              border: '1px solid hsl(var(--footer-border))',
              borderRadius: '8px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              padding: '16px',
              width: '360px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '13px',
              color: 'hsl(var(--footer-text))',
            }}
          >
            <div style={{ marginBottom: '10px', opacity: 0.4, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Link URL
            </div>
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') applyLink();
                if (e.key === 'Escape') cancelLink();
              }}
              placeholder="https://"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'hsl(var(--editor-bg))',
                border: '1px solid hsl(var(--footer-border))',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '13px',
                color: 'hsl(var(--footer-text))',
                outline: 'none',
                marginBottom: '12px',
                fontFamily: 'inherit',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={cancelLink}
                style={{
                  background: 'none',
                  border: '1px solid hsl(var(--footer-border))',
                  borderRadius: '4px',
                  padding: '5px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: 'hsl(var(--footer-text))',
                  fontFamily: 'inherit',
                  opacity: 0.7,
                }}
              >
                Cancel
              </button>
              <button
                onClick={applyLink}
                style={{
                  background: 'hsl(var(--footer-text))',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: 'hsl(var(--editor-bg))',
                  fontFamily: 'inherit',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <EditorFooter
        wordCount={wordCount}
        charCount={charCount}
      />
    </div>
  );
};

export default MarkdownEditor;
