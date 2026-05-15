"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-10",
        className
      )}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
