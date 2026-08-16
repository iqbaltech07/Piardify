import { useState } from "react";
import { Position, Handle } from "@xyflow/react";
import { ListTodo, CheckSquare, Loader2, ChevronRight } from "lucide-react";
import type { TaskItem } from "./types";

export function TasksGroupNode({ id, data }: { id: string; data: any }) {
  const tasks: TaskItem[] = data.tasks || [];
  const [expanded, setExpanded] = useState(false);
  const maxDisplay = 3;
  const displayedTasks = expanded ? tasks : tasks.slice(0, maxDisplay);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "var(--color-circuit)",
          border: "2px solid #10182B",
          width: 8,
          height: 8,
          left: -4,
        }}
      />

      <div
        style={{
          background: "#10182B",
          border: "1px solid rgba(79, 209, 197, 0.4)",
          borderRadius: 8,
          padding: "14px 16px",
          minWidth: 230,
          maxWidth: 280,
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          position: "relative",
        }}
      >
        {/* Header: Icon + TASKS (Circuit / Cyan theme) */}
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
            color: "var(--color-circuit)",
            textTransform: "uppercase",
          }}
        >
          <ListTodo size={12} strokeWidth={2.2} color="var(--color-circuit)" />
          <span>TASKS</span>
        </div>

        {/* Tasks List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {displayedTasks.map((t, tIdx) => {
            const st = (t.status || "todo").toLowerCase();
            const isDone = st === "done";
            const isInProgress = st === "in_progress" || st === "current";

            return (
              <div
                key={t.id || tIdx}
                style={{
                  background: isDone
                    ? "rgba(16, 185, 129, 0.1)"
                    : isInProgress
                    ? "rgba(255, 182, 39, 0.1)"
                    : "#141C30",
                  border: isDone
                    ? "1px solid rgba(16, 185, 129, 0.35)"
                    : isInProgress
                    ? "1px solid rgba(255, 182, 39, 0.35)"
                    : "1px solid var(--border-hairline)",
                  borderRadius: 5,
                  padding: "6px 9px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                {/* Status Checkbox Icon */}
                {isDone ? (
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: "#10B981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    title="Selesai (DONE)"
                  >
                    <CheckSquare size={11} color="#FFFFFF" strokeWidth={3} />
                  </div>
                ) : isInProgress ? (
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      border: "1.5px solid var(--color-signal)",
                      background: "rgba(255, 182, 39, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    title="Sedang Dikerjakan (IN_PROGRESS)"
                  >
                    <Loader2 size={9} color="var(--color-signal)" className="animate-spin" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      border: "1.5px solid var(--color-mist)",
                      background: "transparent",
                      flexShrink: 0,
                    }}
                    title="Belum Dikerjakan (TODO)"
                  />
                )}

                {/* Task Title */}
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: isDone ? "var(--fg-secondary)" : isInProgress ? "var(--color-signal)" : "var(--fg-muted)",
                    fontWeight: isInProgress ? 600 : 500,
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flex: 1,
                  }}
                >
                  {t.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer count toggle */}
        {tasks.length > maxDisplay && (
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
            <span>{expanded ? "Sembunyikan" : `Lihat semua (${tasks.length})`}</span>
            <ChevronRight size={10} />
          </button>
        )}
      </div>
    </>
  );
}
