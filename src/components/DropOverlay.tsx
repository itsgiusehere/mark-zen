interface DropOverlayProps {
  visible: boolean;
}

const DropOverlay = ({ visible }: DropOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none drop-overlay-glow"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
};

export default DropOverlay;
