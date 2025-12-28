"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;

  const Icon =
    toast.type === "success"
      ? CheckCircle
      : toast.type === "error"
      ? AlertCircle
      : Loader2;

  return (
    <div className={`toast ${toast.type}`}>
      <Icon size={18} className={toast.type === "info" ? "spin" : ""} />
      <span>{toast.message}</span>
    </div>
  );
}
