interface EditorFooterProps {
  wordCount: number;
  charCount: number;
}

const EditorFooter = ({ wordCount, charCount }: EditorFooterProps) => {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-end border-t bg-[hsl(var(--footer-bg))] border-[hsl(var(--footer-border))] text-[hsl(var(--footer-text))]"
      style={{
        padding: '12px 24px',
        fontSize: '15px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '0.075px',
        fontWeight: 400
      }}
    >
      <div className="flex items-center gap-6 opacity-60">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </footer>
  );
};

export default EditorFooter;
