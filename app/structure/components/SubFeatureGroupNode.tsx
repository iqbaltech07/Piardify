import { useState } from "react";
import { Position, Handle } from "@xyflow/react";
import { LayoutGrid, ChevronRight } from "lucide-react";
import type { StrukturChild } from "./types";

export function SubFeatureGroupNode({ id, data }: { id: string; data: any }) {
  const children: StrukturChild[] = data.children || [];
  const color = data.color || "var(--color-circuit)";
  const [expanded, setExpanded] = useState(false);
  const maxDisplay = 3;
  const displayedChildren = expanded ? children : children.slice(0, maxDisplay);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={data.isEditing}
        style={{
          background: color,
          border: "2px solid #10182B",
          width: 8,
          height: 8,
          left: -4,
          cursor: data.isEditing ? "crosshair" : "default",
        }}
      />

      <div
        style={{
          background: "#10182B",
          border: "1px solid var(--border-hairline)",
          borderRadius: 8,
          padding: "14px 16px",
          minWidth: 220,
          maxWidth: 260,
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          position: "relative",
        }}
      >
        {/* Header: Icon + SUB FITUR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--color-mist)",
            textTransform: "uppercase",
          }}
        >
          <LayoutGrid size={11} strokeWidth={2.2} color="var(--color-mist)" />
          <span>SUB FITUR</span>
        </div>

        {/* Stacked Sub-features list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {displayedChildren.map((child, cIdx) => (
            <div
              key={child.id || cIdx}
              style={{
                background: "#141C30",
                border: "1px solid var(--border-hairline)",
                borderRadius: 5,
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.9 }} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--fg-secondary)",
                  fontWeight: 500,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {child.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer count toggle */}
        {children.length > maxDisplay && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginTop: 8,
              background: "transparent",
              border: "none",
              color: "var(--color-mist)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: 0,
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <span>{expanded ? "Sembunyikan" : `Lihat semua (${children.length})`}</span>
            <ChevronRight size={10} />
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={data.isEditing}
        style={{
          background: color,
          border: "2px solid #10182B",
          width: 8,
          height: 8,
          right: -4,
          cursor: data.isEditing ? "crosshair" : "default",
        }}
      />
    </>
  );
}
