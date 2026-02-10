interface DropOverlayProps {
  visible: boolean;
}

const DropOverlay = ({ visible }: DropOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-[hsl(var(--drop-overlay))] drop-overlay-pulse" />
      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-[hsl(var(--drop-overlay))] drop-overlay-pulse" />
      {/* Left */}
      <div className="absolute top-0 left-0 bottom-0 w-3 bg-[hsl(var(--drop-overlay))] drop-overlay-pulse" />
      {/* Right */}
      <div className="absolute top-0 right-0 bottom-0 w-3 bg-[hsl(var(--drop-overlay))] drop-overlay-pulse" />
    </div>
  );
};

export default DropOverlay;
