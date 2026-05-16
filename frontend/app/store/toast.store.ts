import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, description?: string, action?: Toast["action"]) =>
    useToastStore.getState().addToast({ title, description, type: "success", action }),
  error: (title: string, description?: string, action?: Toast["action"]) =>
    useToastStore.getState().addToast({ title, description, type: "error", action }),
  info: (title: string, description?: string, action?: Toast["action"]) =>
    useToastStore.getState().addToast({ title, description, type: "info", action }),
  warning: (title: string, description?: string, action?: Toast["action"]) =>
    useToastStore.getState().addToast({ title, description, type: "warning", action }),
};
