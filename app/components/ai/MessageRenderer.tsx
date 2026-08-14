"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Bot, User, AlertCircle } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CopyButton } from "./CopyButton";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

interface MessageRendererProps {
  message: Message;
  onCopy?: (content: string) => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackText: string },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MessageRenderer error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Failed to render formatted message</span>
          </div>
          <p className="font-mono text-[11px] text-rose-200/80 whitespace-pre-wrap">
            {this.props.fallbackText}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MessageRendererComponent: React.FC<MessageRendererProps> = ({
  message,
  className = "",
}) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 w-full min-w-0 my-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } ${className}`}
    >
      {/* Role Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all ${
          isUser
            ? "bg-linear-to-br from-indigo-500 to-indigo-700 text-white border border-indigo-400/30"
            : "bg-linear-to-br from-purple-900/60 to-indigo-900/60 text-purple-300 border border-purple-500/30"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-purple-300" />}
      </div>

      {/* Bubble Container */}
      <div className={`group relative min-w-0 max-w-[85%] sm:max-w-[82%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md transition-all min-w-0 max-w-full overflow-hidden wrap-break-word ${
            isUser
              ? "rounded-tr-xs bg-linear-to-br from-indigo-600/30 via-indigo-700/25 to-indigo-900/30 border border-indigo-500/40 text-slate-100"
              : "rounded-tl-xs bg-[#121318]/80 border border-slate-800/90 text-slate-200"
          }`}
        >
          {/* Top Quick Actions (Copy) */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <CopyButton content={message.content} />
          </div>

          {/* Render Body */}
          {isUser ? (
            <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-100">
              {message.content}
            </p>
          ) : (
            <ComponentErrorBoundary fallbackText={message.content}>
              <MarkdownRenderer content={message.content} />
            </ComponentErrorBoundary>
          )}

          {/* Streaming Dot Indicator */}
          {message.isStreaming && (
            <div className="inline-flex items-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
            {message.timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const MessageRenderer = memo(MessageRendererComponent);
