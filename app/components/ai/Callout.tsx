"use client";

import React from "react";
import { Info, AlertTriangle, CheckCircle2, AlertOctagon, Sparkles } from "lucide-react";

export type CalloutType = "info" | "warning" | "success" | "error" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type = "info", title, children }) => {
  const config = {
    info: {
      icon: Info,
      border: "border-indigo-500/30",
      bg: "bg-gradient-to-r from-indigo-950/40 via-indigo-900/20 to-slate-950/40",
      text: "text-indigo-300",
      titleColor: "text-indigo-200",
      defaultTitle: "Note",
    },
    warning: {
      icon: AlertTriangle,
      border: "border-amber-500/30",
      bg: "bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-950/40",
      text: "text-amber-300",
      titleColor: "text-amber-200",
      defaultTitle: "Warning",
    },
    success: {
      icon: CheckCircle2,
      border: "border-emerald-500/30",
      bg: "bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-slate-950/40",
      text: "text-emerald-300",
      titleColor: "text-emerald-200",
      defaultTitle: "Success",
    },
    error: {
      icon: AlertOctagon,
      border: "border-rose-500/30",
      bg: "bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-slate-950/40",
      text: "text-rose-300",
      titleColor: "text-rose-200",
      defaultTitle: "Important",
    },
    tip: {
      icon: Sparkles,
      border: "border-purple-500/30",
      bg: "bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-slate-950/40",
      text: "text-purple-300",
      titleColor: "text-purple-200",
      defaultTitle: "Tip",
    },
  }[type] || {
    icon: Info,
    border: "border-indigo-500/30",
    bg: "bg-indigo-950/30",
    text: "text-indigo-300",
    titleColor: "text-indigo-200",
    defaultTitle: "Note",
  };

  const IconComponent = config.icon;

  return (
    <div className={`my-4 rounded-xl border ${config.border} ${config.bg} p-4 shadow-md backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
        <IconComponent className={`w-4 h-4 ${config.text}`} />
        <span className={config.titleColor}>{title || config.defaultTitle}</span>
      </div>
      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};
