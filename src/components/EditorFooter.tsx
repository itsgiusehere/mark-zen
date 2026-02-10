interface EditorFooterProps {
  wordCount: number;
  charCount: number;
  saveStatus: string;
  fileName?: string;
  lastModified?: string;
}

const EditorFooter = ({ wordCount, charCount, saveStatus, fileName, lastModified }: EditorFooterProps) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-10 text-xs border-t bg-[hsl(var(--footer-bg))] border-[hsl(var(--footer-border))] text-[hsl(var(--footer-text))]">
      <div className="flex items-center gap-4">
        <span>{wordCount} words</span>
        <span>{charCount} chars</span>
        {fileName && (
          <span className="opacity-70">{fileName}</span>
        )}
        {lastModified && (
          <span className="opacity-70">Modified: {lastModified}</span>
        )}
      </div>
      <div>
        <span>{saveStatus}</span>
      </div>
    </footer>
  );
};

export default EditorFooter;
