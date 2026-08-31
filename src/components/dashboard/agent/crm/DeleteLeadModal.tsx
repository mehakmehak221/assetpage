'use client';

import React, { useState } from 'react';
import { Lead } from '@/types/crm';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteLeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({ isOpen, lead, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !lead) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete lead. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-bg-dark)]/80 backdrop-blur-sm font-montserrat">
      <div className="bg-[var(--form-surface)] border border-[var(--sidebar-border)] rounded-md shadow-2xl w-full max-w-md overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[var(--color-status-error-bg)] text-[var(--color-error-500)] flex items-center justify-center border border-[var(--color-primary-300)]/20">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[var(--foreground)] tracking-wide">Delete Lead</h3>
              <p className="text-[11px] text-[var(--sidebar-text)] opacity-60 mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-8 h-8 rounded-md text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/10 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="px-6 py-5 space-y-4">


          <div className="flex items-start gap-3 p-4 rounded-md bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)]">
            <AlertTriangle className="w-5 h-5 text-[var(--color-error-500)] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-[var(--foreground)]">
                Remove <span className="text-[var(--color-error-500)]">{lead.name}</span>?
              </p>
              <p className="text-xs text-[var(--sidebar-text)] opacity-70 leading-relaxed">
                All associated notes, follow-ups, and activity history for this lead will be permanently deleted and cannot be recovered.
              </p>
            </div>
          </div>


          <div className="bg-[var(--card-surface)] rounded-md border border-[var(--sidebar-border)] divide-y divide-[var(--sidebar-border)]">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[var(--sidebar-text)] opacity-60 font-bold uppercase tracking-wider text-[9px]">LEAD ID</span>
              <span className="font-mono text-[11px] text-[var(--sidebar-text)]">{lead.id.slice(-8)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[var(--sidebar-text)] opacity-60 font-bold uppercase tracking-wider text-[9px]">PHONE</span>
              <span className="text-[var(--foreground)] font-bold tracking-wide font-mono text-[13px]">{lead.phone}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[var(--sidebar-text)] opacity-60 font-bold uppercase tracking-wider text-[9px]">STATUS</span>
              <span className="text-[var(--foreground)] font-black uppercase text-[11px] tracking-wider">{lead.status.replace('_', ' ')}</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-md bg-[var(--color-status-error-bg)] border border-[var(--color-status-error-border)] text-[var(--color-error-500)] text-xs font-mono break-all leading-normal">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--sidebar-border)] bg-[var(--card-surface)]/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md text-xs font-bold text-[var(--sidebar-text)] hover:text-[var(--foreground)] hover:bg-[var(--color-primary-300)]/8 transition-colors cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-md bg-[var(--color-error-500)] hover:bg-[var(--color-error-500)]/90 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 shadow-lg shadow-[var(--color-error-500)]/25"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};
