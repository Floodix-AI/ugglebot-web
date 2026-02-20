"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
  duration?: number;
}

const variants: Record<ToastVariant, { icon: typeof CheckCircle; bg: string; border: string; text: string }> = {
  success: {
    icon: CheckCircle,
    bg: "bg-forest-50",
    border: "border-forest-400/30",
    text: "text-forest-600",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-300/30",
    text: "text-red-600",
  },
  info: {
    icon: Info,
    bg: "bg-glow-50",
    border: "border-glow-400/30",
    text: "text-glow-700",
  },
};

export function Toast({ message, variant, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const style = variants[variant];
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${style.bg} ${style.border} min-w-[280px] max-w-[400px]`}
        >
          <Icon className={`h-5 w-5 flex-shrink-0 ${style.text}`} />
          <p className={`text-sm font-medium flex-1 ${style.text}`}>{message}</p>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`flex-shrink-0 ${style.text} opacity-60 hover:opacity-100 transition-opacity`}
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
