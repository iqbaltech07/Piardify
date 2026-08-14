"use client";

import React, { useState } from "react";
import { Maximize2, X } from "lucide-react";

interface ImageBlockProps {
  src?: string;
  alt?: string;
  title?: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ src, alt, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="my-3 p-4 border border-dashed border-slate-800 rounded-xl bg-[#121318]/40 text-center text-xs text-slate-500 font-mono">
        🖼️ Image unavailable ({alt || "no description"})
      </div>
    );
  }

  return (
    <>
      <div className="group relative my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 shadow-lg">
        <img
          src={src}
          alt={alt || "AI generated attachment"}
          loading="lazy"
          onError={() => setError(true)}
          onClick={() => setIsOpen(true)}
          className="w-full max-h-112.5 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Hover zoom icon badge */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#121318]/80 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
          title="Zoom image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {alt && (
          <div className="p-2 text-center text-xs text-slate-400 bg-[#121318]/80 border-t border-slate-800/60 italic font-mono">
            {alt}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#090A0C]/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={src}
            alt={alt || "Zoomed view"}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
