'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, Trash2, X, AlertTriangle } from 'lucide-react';

export interface ToastConfig {
  message: string;
  type: 'success' | 'error';
}

interface CrmToastProps {
  toast: ToastConfig | null;
  onDismiss: () => void;
}

export const CrmToast: React.FC<CrmToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] font-montserrat animate-fade-in"
      style={{ minWidth: '300px', maxWidth: '400px' }}
    >
      <div
        className={`relative flex items-start gap-4 px-4 py-4 rounded-md overflow-hidden border shadow-2xl ${isSuccess
            ? 'bg-[var(--form-surface)] border-[var(--color-primary-300)]/30 shadow-[var(--color-primary-300)]/10'
            : 'bg-[var(--form-surface)] border-[var(--color-error-500)]/30 shadow-[var(--color-error-500)]/10'
          }`}
      >

        <div
          className={`absolute inset-y-0 left-0 w-1 rounded-l-md ${isSuccess ? 'bg-[var(--color-primary-300)]' : 'bg-[var(--color-error-500)]'
            }`}
        />

        <div
          className={`ml-2 mt-0.5 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isSuccess
              ? 'bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)]'
              : 'bg-[var(--color-status-error-bg)] text-[var(--color-error-500)]'
            }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 pt-0.5 space-y-0.5">
          <p className={`text-xs font-black uppercase tracking-widest ${isSuccess ? 'text-[var(--color-primary-300)]' : 'text-[var(--color-error-500)]'
            }`}>
            {isSuccess ? 'Lead Deleted' : 'Action Failed'}
          </p>
          <p className="text-xs text-[var(--sidebar-text)] leading-relaxed opacity-80">
            {toast.message}
          </p>
        </div>


        <button
          onClick={onDismiss}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[var(--sidebar-text)] opacity-50 hover:opacity-100 hover:bg-[var(--sidebar-border)] transition-all cursor-pointer mt-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>


        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
          <div
            className={`h-full w-full animate-shrink-x origin-left ${isSuccess ? 'bg-[var(--color-primary-300)]/50' : 'bg-[var(--color-error-500)]/50'
              }`}
          />
        </div>
      </div>
    </div>
  );
};
