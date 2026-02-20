"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  hover = false,
  padding = "md",
  className = "",
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`bg-white rounded-2xl border border-night-100 shadow-sm ${paddingClasses[padding]} ${
        hover
          ? "hover:shadow-md hover:border-night-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
