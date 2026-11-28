import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

export default function ConfirmModal({
  open,
  eyebrow = 'PARADOX / VERIFICATION',
  title = 'CONFIRM ACTION',
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="prdx-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prdx-modal-title"
      onClick={onCancel}
    >
      <div
        className="prdx-modal-box"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="prdx-modal-top">
          <span className="prdx-modal-eyebrow">{eyebrow}</span>
          <button
            type="button"
            className="prdx-modal-close"
            aria-label="Close dialog"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </div>

        <div className="prdx-modal-body">
          <div className={`prdx-modal-icon ${danger ? 'is-danger' : ''}`}>
            <AlertTriangle size={20} strokeWidth={1.8} />
          </div>
          <h2 id="prdx-modal-title" className="prdx-modal-title">
            {title}
          </h2>
          {message && <p className="prdx-modal-message">{message}</p>}
        </div>

        <div className="prdx-modal-actions">
          <button
            type="button"
            className="prdx-modal-btn prdx-modal-cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`prdx-modal-btn prdx-modal-confirm ${danger ? 'is-danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}