"use client";

import { useToastStore } from "@/app/store/toast.store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-0 left-0 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 w-full sm:w-[350px] px-4 pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-[#10b981]" />,
          error: <AlertCircle className="h-5 w-5 text-[#ef4444]" />,
          info: <Info className="h-5 w-5 text-[#3b82f6]" />,
        };

        return (
          <div
            key={t.id}
            style={{ animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-lg w-full"
          >
            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#111827]">{t.title}</p>
              {t.description && (
                <p className="mt-1 text-sm text-[#6b7280]">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-[#9ca3af] hover:text-[#111827] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
