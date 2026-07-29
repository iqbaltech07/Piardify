import React, { useState, useRef, useEffect } from "react";
import { StackCategory, FormData } from "../types";
import { TECH_CATEGORIES } from "../constants";
import { Check, ChevronDown, Bot, Construction, Plus, X, Search } from "lucide-react";

interface Step2TechStackProps {
  stackMode: FormData["stackMode"];
  stacks: FormData["stacks"];
  setStackMode: (mode: FormData["stackMode"]) => void;
  setStack: (category: StackCategory, label: string) => void;
}

function TechStackCombobox({
  category,
  value,
  onChange,
  defaultOptions,
  title,
}: {
  category: StackCategory;
  value: string;
  onChange: (val: string) => void;
  defaultOptions: string[];
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleCustomAdd = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      onChange(trimmed);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = searchTerm.trim();
      if (!trimmed) return;

      const exactMatch = defaultOptions.find(
        (opt) => opt.toLowerCase() === trimmed.toLowerCase()
      );
      if (exactMatch) {
        handleSelect(exactMatch);
      } else {
        handleCustomAdd();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const filteredOptions = defaultOptions.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasExactMatch = defaultOptions.some(
    (opt) => opt.toLowerCase() === searchTerm.trim().toLowerCase()
  );

  const isCustomValue = Boolean(value && !defaultOptions.includes(value));

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Combobox Trigger */}
      <div
        onClick={() => {
          setIsOpen((prev) => !prev);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        style={{
          width: "100%",
          padding: value ? "10px 32px 10px 14px" : "10px 32px 10px 14px",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-base)",
          border: `1px solid ${value ? "var(--color-circuit)" : "var(--border-hairline)"}`,
          color: value ? "var(--fg-primary)" : "var(--fg-muted)",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          transition: "all 0.15s",
          userSelect: "none",
        }}
      >
        {value ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Check size={12} strokeWidth={3} style={{ color: "var(--color-circuit)", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: "var(--fg-primary)" }}>
              {value}{" "}
              {isCustomValue && (
                <span style={{ fontSize: "10px", color: "var(--color-signal)", opacity: 0.9 }}>
                  (Custom)
                </span>
              )}
            </span>
          </div>
        ) : (
          <span style={{ color: "var(--fg-muted)" }}>Select or type {title}…</span>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearchTerm("");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--fg-muted)",
                cursor: "pointer",
                padding: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={13}
            style={{
              color: "var(--fg-muted)",
              transform: isOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,209,197,0.2)",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {/* Search / Custom input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              background: "var(--bg-base)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <Search size={12} style={{ color: "var(--fg-muted)", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Search or type custom ${title}…`}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "var(--fg-primary)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                outline: "none",
              }}
            />
          </div>

          {/* Options list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredOptions.map((opt) => {
              const isSelected = value === opt;
              return (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: isSelected ? 700 : 400,
                    color: isSelected ? "var(--color-circuit)" : "var(--fg-primary)",
                    background: isSelected ? "rgba(79,209,197,0.1)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span>{opt}</span>
                  {isSelected && <Check size={12} strokeWidth={2.5} style={{ color: "var(--color-circuit)" }} />}
                </div>
              );
            })}

            {/* Custom option prompt if search term doesn't match exactly */}
            {searchTerm.trim() && !hasExactMatch && (
              <div
                onClick={handleCustomAdd}
                style={{
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-signal)",
                  background: "rgba(255,182,39,0.1)",
                  border: "1px dashed rgba(255,182,39,0.3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <Plus size={13} style={{ color: "var(--color-signal)" }} />
                <span>Use custom: <strong>"{searchTerm.trim()}"</strong></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Step2TechStack({
  stackMode,
  stacks,
  setStackMode,
  setStack,
}: Step2TechStackProps) {
  const selectedCount = Object.values(stacks).filter((v) => v !== "").length;

  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 10px",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-xs)",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-circuit)",
          marginBottom: 14,
        }}
      >
        Step 02 / Tech Stack
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--fg-primary)",
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}
      >
        Choose your tech stack
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--color-mist)",
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        Select default technologies or type your custom tech stack choice.
      </p>

      {/* Mode selector */}
      <div
        style={{
          display: "flex",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {(["manual", "ai"] as const).map((mode, i) => (
          <button
            key={mode}
            id={`stack-mode-${mode}`}
            onClick={() => setStackMode(mode)}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: stackMode === mode ? "var(--color-signal)" : "var(--bg-elevated)",
              color: stackMode === mode ? "var(--color-graphite)" : "var(--fg-muted)",
              border: "none",
              borderLeft: i > 0 ? "1px solid var(--border-hairline)" : "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
          >
            {mode === "ai" && <Bot size={12} />}
            {mode === "manual" ? "Manual / Custom" : "AI Recommend"}
          </button>
        ))}
      </div>

      {stackMode === "manual" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Selection counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--fg-secondary)" }}>
              Select from dropdown or type custom technology
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 700,
                color: selectedCount === 4 ? "var(--color-signal)" : "var(--fg-muted)",
                letterSpacing: "0.08em",
              }}
            >
              {selectedCount}/4 selected
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="layer-grid">
            {TECH_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "var(--bg-elevated)",
                  border: `1px solid ${stacks[cat.id] ? "var(--color-circuit)" : "var(--border-hairline)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transition: "border-color 0.15s",
                }}
              >
                {/* Category header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-hairline)",
                      background: "var(--bg-base)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-circuit)",
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--fg-primary)",
                        marginBottom: 1,
                      }}
                    >
                      {cat.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        color: "var(--fg-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {cat.subtitle}
                    </div>
                  </div>
                </div>

                {/* Combobox with Custom Input */}
                <TechStackCombobox
                  category={cat.id}
                  value={stacks[cat.id]}
                  onChange={(val) => setStack(cat.id, val)}
                  defaultOptions={cat.options}
                  title={cat.title}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "32px",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            background: "var(--bg-elevated)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-xs)",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-signal)",
              marginBottom: 12,
            }}
          >
            <Construction size={10} />
            Coming Soon
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--fg-primary)", marginBottom: 6 }}>
            AI Stack Recommendation
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-mist)" }}>
            Our AI will analyze your idea and recommend the optimal tech stack. Use Manual Selection for now.
          </p>
        </div>
      )}
    </div>
  );
}
