"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar, Footer } from "../components/layout";
import {
  GitCommit,
  ArrowLeft,
  Tag,
  Clock,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { RELEASES, type Category, type ReleaseItem } from "@/lib/utils/changelogData";

export default function ChangelogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredReleases = RELEASES.map((release) => ({
    ...release,
    highlights: release.highlights.filter((item) =>
      activeCategory === "all" ? true : item.type === activeCategory
    ),
  })).filter((release) => release.highlights.length > 0);

  const getTagColor = (type: ReleaseItem["type"]) => {
    switch (type) {
      case "feat":
        return {
          bg: "rgba(255, 182, 39, 0.12)",
          border: "rgba(255, 182, 39, 0.3)",
          text: "var(--color-signal)",
          label: "Feature",
        };
      case "improvement":
        return {
          bg: "rgba(79, 209, 197, 0.12)",
          border: "rgba(79, 209, 197, 0.3)",
          text: "var(--color-circuit)",
          label: "Improvement",
        };
      case "fix":
        return {
          bg: "rgba(248, 113, 113, 0.12)",
          border: "rgba(248, 113, 113, 0.3)",
          text: "#F87171",
          label: "Fix",
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-base) text-(--fg-primary)">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-28 pb-20">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-(--color-mist) hover:text-(--fg-primary) transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Moryn
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-(--border-hairline) pb-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[rgba(255,182,39,0.1)] border border-[rgba(255,182,39,0.25)] flex items-center justify-center text-(--color-signal)">
                <GitCommit size={20} />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-(--fg-primary)">
                  Changelog
                </h1>
                <p className="font-mono text-xs text-(--color-mist) tracking-wide uppercase mt-1">
                  Product Updates & Architecture Evolution
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--bg-elevated) border border-(--border-hairline)">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--color-signal) opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-(--color-signal)"></span>
              </span>
              <span className="font-mono text-xs font-semibold text-(--fg-primary)">
                {RELEASES[0].version} Active
              </span>
            </div>
          </div>

          <p className="text-sm text-(--fg-secondary) max-w-2xl leading-relaxed">
            Catatan rilis resmi perkembangan platform Moryn, integrasi AI Agent, protokol sinkronisasi otonom, dan penyempurnaan desain sistem.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {(
              [
                { id: "all", label: "All Updates" },
                { id: "feat", label: "Features" },
                { id: "improvement", label: "Improvements" },
                { id: "fix", label: "Fixes" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                  activeCategory === tab.id
                    ? "bg-(--color-signal) text-(--color-graphite) font-bold"
                    : "bg-(--bg-elevated) text-(--color-mist) border border-(--border-hairline) hover:text-(--fg-primary) hover:border-(--border-strong)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Releases */}
        <div className="relative pl-6 md:pl-10 border-l border-(--border-hairline) space-y-14">
          {filteredReleases.map((release) => (
            <div key={release.version} className="relative group">
              {/* Timeline Marker Node */}
              <div className="absolute -left-7.75 md:-left-11.75 top-1 w-5 h-5 rounded-full bg-(--bg-surface) border-2 border-(--color-signal) flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-(--color-signal)" />
              </div>

              {/* Release Header */}
              <div className="flex flex-wrap items-baseline gap-3 mb-3">
                <span className="font-mono text-xl font-bold text-(--color-signal) tracking-tight">
                  {release.version}
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-(--color-mist)">
                  <Clock size={12} />
                  <span>{release.date}</span>
                </div>
                {release.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[rgba(255,182,39,0.15)] text-(--color-signal) border border-[rgba(255,182,39,0.3)]">
                    {release.badge}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-(--fg-primary) mb-2">
                {release.title}
              </h2>
              <p className="text-sm text-(--fg-secondary) mb-6 leading-relaxed">
                {release.summary}
              </p>

              {/* Code Snippet if present */}
              {release.codeSnippet && (
                <div className="mb-6 rounded-lg bg-(--bg-elevated) border border-(--border-hairline) overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-(--bg-surface) border-b border-(--border-hairline) font-mono text-[11px] text-(--color-mist)">
                    <div className="flex items-center gap-2">
                      <Code2 size={13} className="text-(--color-circuit)" />
                      <span>Quick CLI Execution</span>
                    </div>
                    <span>{release.codeSnippet.language}</span>
                  </div>
                  <pre className="p-4 font-mono text-xs text-(--fg-primary) overflow-x-auto leading-relaxed">
                    <code>{release.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Highlight Items Grid */}
              <div className="grid grid-cols-1 gap-4">
                {release.highlights.map((item, idx) => {
                  const tagMeta = getTagColor(item.type);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-(--bg-surface) border border-(--border-hairline) hover:border-(--border-strong) transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-sm text-(--fg-primary) flex items-center gap-2">
                          <CheckCircle2
                            size={15}
                            className="text-(--color-signal) shrink-0"
                          />
                          {item.title}
                        </h3>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0"
                          style={{
                            backgroundColor: tagMeta.bg,
                            borderColor: tagMeta.border,
                            color: tagMeta.text,
                            borderWidth: "1px",
                          }}
                        >
                          {tagMeta.label}
                        </span>
                      </div>
                      <p className="text-xs text-(--fg-secondary) leading-relaxed mb-3 pl-6">
                        {item.description}
                      </p>

                      {item.tags && (
                        <div className="flex flex-wrap items-center gap-1.5 pl-6">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] text-(--color-mist) bg-(--bg-elevated) border border-(--border-hairline)"
                            >
                              <Tag size={9} />
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
