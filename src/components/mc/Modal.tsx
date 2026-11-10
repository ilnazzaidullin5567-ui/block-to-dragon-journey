import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { McButton } from "./McButton";

export function Modal({
  open,
  onClose,
  children,
  label,
  onKey,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  onKey?: (e: KeyboardEvent) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      onKey?.(e);
    };
    window.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, onKey]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <McButton
          variant="lava"
          size="icon"
          aria-label="Закрыть"
          className="absolute -top-4 -right-2 z-10 sm:-right-4"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </McButton>
        {children}
      </div>
    </div>
  );
}
