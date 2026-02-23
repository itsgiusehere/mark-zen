import { useState, useRef, useEffect } from 'react';

const shortcuts = [
  { trigger: 'Cmd B',       description: 'Bold' },
  { trigger: 'Cmd I',       description: 'Italic' },
  { trigger: 'Cmd U',       description: 'Underline' },
  { trigger: 'Cmd ⇧ S',    description: 'Strikethrough' },
  { trigger: 'Cmd ⇧ H',    description: 'Highlight' },
  { trigger: 'Cmd E',       description: 'Inline code' },
  { trigger: 'Cmd ⇧ B',    description: 'Blockquote' },
  { trigger: 'Cmd K',       description: 'Link (on selection)' },
  { trigger: 'Cmd Z',       description: 'Undo' },
  { trigger: 'Cmd ⇧ Z',    description: 'Redo' },
  { trigger: 'Tab',         description: 'Indent list item' },
  { trigger: '⇧ Tab',      description: 'Outdent list item' },
  { trigger: 'Enter',       description: 'Exit heading' },
];

const ShortcutsPopover = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        title="Markdown shortcuts"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 6px',
          borderRadius: '4px',
          opacity: 0.5,
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: '13px',
          letterSpacing: '0.05px',
          transition: 'opacity 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = open ? '0.9' : '0.5')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M8 8h.01M12 8h4M8 12h.01M12 12h4M8 16h.01M12 16h4"/>
        </svg>
        Shortcuts
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: 0,
            width: '280px',
            background: 'hsl(var(--footer-bg))',
            border: '1px solid hsl(var(--footer-border))',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '13px',
            color: 'hsl(var(--footer-text))',
            zIndex: 200,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {shortcuts.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.55 }}>{item.description}</span>
                <kbd style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: '12px',
                  background: 'hsl(var(--footer-border))',
                  borderRadius: '4px',
                  padding: '1px 6px',
                  opacity: 0.85,
                }}>
                  {item.trigger}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcutsPopover;
