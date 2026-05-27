import { useEffect } from "react";
import type { ReactNode } from "react";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const modalRoot = document.querySelector("#modal-root") || document.body;

export const Modal = ({ children, onClose }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={32} />
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
