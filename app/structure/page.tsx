"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FileText, LayoutGrid, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  Handle,
  BaseEdge,
  getBezierPath,
  type EdgeProps,
  type Node,
  type Edge,
  type Connection,
  BackgroundVariant,
} from "@xyflow/react";
import { apiClient } from "@/lib/apiClient";
import { useProjectStore } from "@/stores/useProjectStore";
import "@xyflow/react/dist/style.css";
import StepNavbar from "../components/StepNavbar";
import ProjectHeaderBrand from "../components/ProjectHeaderBrand";
import { StructureSkeleton } from "../components/Skeletons";

/* ─── Types ─── */
interface StrukturChild { id: string; label: string; }
interface StrukturNode { id: string; label: string; phase?: number; color?: string; children: StrukturChild[]; }
interface StrukturData { title: string; description: string; nodes: StrukturNode[]; }

/* ─── Phase palette — blueprint tokens ─── */
const PHASE_COLORS: Record<number, { border: string; badge: string }> = {
  1: { border: "var(--color-signal)",  badge: "Phase 1 · Core"   },
  2: { border: "var(--color-circuit)", badge: "Phase 2 · Growth"  },
  3: { border: "#8B93A7",              badge: "Phase 3 · Future"  },
};

/* ─── Custom Node: Root ─── */
function RootNode({ id, data }: { id: string; data: any }) {
  return (
    <>
      <div style={{
        background: "#141C30",
        border: "1px solid var(--color-signal)",
        borderRadius: 6,
        padding: "16px 20px",
        minWidth: 200, maxWidth: 250,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 4,
            border: "1px solid rgba(255,182,39,0.3)",
            background: "rgba(255,182,39,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <FileText size={13} strokeWidth={2} color="var(--color-signal)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--fg-primary)", lineHeight: 1.25 }}>
              {data.isEditing ? (
                <input
                  value={data.label}
                  onChange={(e) => data.onChange(id, "label", e.target.value)}
                  style={{ background: "transparent", border: "none", color: "inherit", fontWeight: "inherit", fontSize: "inherit", outline: "none", borderBottom: "1px solid var(--color-signal)", width: "100%", padding: 0 }}
                  autoFocus
                />
              ) : data.label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-signal)", opacity: 0.7, marginTop: 2 }}>
              Product Architecture
            </div>
          </div>
        </div>
        {data.description && (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.55, borderTop: "1px solid rgba(255,182,39,0.15)", paddingTop: 8 }}>
            {data.description}
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-mist)", border: "1px solid var(--border-hairline)", borderRadius: 2, padding: "2px 7px" }}>
            {data.nodeCount} modules
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={data.isEditing}
        style={{ background: "var(--color-signal)", border: "2px solid #10182B", width: 12, height: 12, right: -6, cursor: data.isEditing ? "crosshair" : "default" }}
      />
    </>
  );
}

/* ─── Custom Node: Category ─── */
function CategoryNode({ id, data }: { id: string; data: any }) {
  const phase = PHASE_COLORS[data.phase] || PHASE_COLORS[1];
  const color = data.color || phase.border;
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={data.isEditing}
        style={{ background: color, border: "2px solid #10182B", width: 10, height: 10, left: -5, cursor: data.isEditing ? "crosshair" : "default" }}
      />
      <div style={{
        background: "#141C30",
        border: `1px solid ${color}`,
        borderRadius: 6,
        padding: "12px 16px",
        minWidth: 190, maxWidth: 230,
        position: "relative",
      }}>
        {/* Phase annotation */}
        <div style={{
          position: "absolute", top: -10, left: 12,
          display: "flex", alignItems: "center", gap: 6,
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--color-graphite)", background: color,
            padding: "2px 8px", borderRadius: 2,
          }}>
            {phase.badge}
          </span>
          {data.isEditing && (
            <div
              onClick={() => data.onDelete(id)}
              style={{ background: "#f87171", color: "white", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", pointerEvents: "auto" }}
              title="Delete category"
            >
              <Trash2 size={9} strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${color}44`, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LayoutGrid size={12} strokeWidth={2} color={color} />
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--fg-primary)", lineHeight: 1.3, flex: 1 }}>
            {data.isEditing ? (
              <input
                value={data.label}
                onChange={(e) => data.onChange(id, "label", e.target.value)}
                style={{ background: "transparent", border: "none", color: "inherit", fontWeight: "inherit", fontSize: "inherit", outline: "none", borderBottom: `1px solid ${color}`, width: "100%", padding: 0 }}
                autoFocus
              />
            ) : data.label}
          </div>
        </div>

        <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-muted)", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.06em" }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: color, opacity: 0.7 }} />
          {data.childCount} sub-features
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={data.isEditing}
        style={{ background: color, border: "2px solid #10182B", width: 10, height: 10, right: -5, cursor: data.isEditing ? "crosshair" : "default" }}
      />
    </>
  );
}

/* ─── Custom Node: Leaf ─── */
function LeafNode({ id, data }: { id: string; data: any }) {
  const color = data.color || "var(--color-mist)";
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={data.isEditing}
        style={{ background: color, border: "2px solid #10182B", width: 8, height: 8, left: -4, opacity: 0.7, cursor: data.isEditing ? "crosshair" : "default" }}
      />
      <div style={{
        background: "#10182B",
        border: "1px solid var(--border-hairline)",
        borderRadius: 4,
        padding: "6px 10px",
        minWidth: 150, maxWidth: 210,
        display: "flex", alignItems: "center", gap: 7,
      }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.8 }} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--fg-secondary)", fontWeight: 500, lineHeight: 1.35, flex: 1 }}>
          {data.isEditing ? (
            <input
              value={data.label}
              onChange={(e) => data.onChange(id, "label", e.target.value)}
              style={{ background: "transparent", border: "none", color: "inherit", fontWeight: "inherit", fontSize: "inherit", outline: "none", borderBottom: `1px solid ${color}`, width: "100%", padding: 0 }}
              autoFocus
            />
          ) : data.label}
        </span>
        {data.isEditing && (
          <div
            onClick={() => data.onDelete(id)}
            style={{ color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", padding: 2 }}
          >
            <Trash2 size={11} strokeWidth={2} />
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Custom Edge ─── */
function ColoredEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, curvature: 0.15 });
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}

const nodeTypes = { root: RootNode, category: CategoryNode, leaf: LeafNode };
const edgeTypes = { colored: ColoredEdge };

/* ─── Graph builder ─── */
function buildGraph(data: StrukturData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const ROOT_X = 50, CAT_X = 500, LEAF_X = 880;
  const CAT_HEIGHT = 80, LEAF_HEIGHT = 42, LEAF_GAP = 24, CAT_GAP = 100;

  type GroupMeta = { catNode: StrukturNode; groupHeight: number; color: string; phase: number };
  const groups: GroupMeta[] = data.nodes.map((catNode, idx) => {
    const childCount = catNode.children.length;
    const leavesH = childCount * LEAF_HEIGHT + Math.max(0, childCount - 1) * LEAF_GAP;
    const groupHeight = Math.max(CAT_HEIGHT, leavesH);
    const defaults = ["#FFB627","#4FD1C5","#8B93A7","#60A5FA","#A78BFA","#F472B6","#34D399"];
    const color = catNode.color || defaults[idx % defaults.length];
    const phase = catNode.phase || Math.min(Math.floor(idx / 2) + 1, 3);
    return { catNode, groupHeight, color, phase };
  });

  const totalH = groups.reduce((s, g) => s + g.groupHeight, 0) + Math.max(0, groups.length - 1) * CAT_GAP;
  nodes.push({ id: "root", type: "root", position: { x: ROOT_X, y: totalH / 2 - 70 }, data: { label: data.title, description: data.description, nodeCount: data.nodes.length } });

  let currentY = 0;
  groups.forEach(({ catNode, groupHeight, color, phase }, idx) => {
    const catId = `cat-${idx}`;
    const catCY = currentY + groupHeight / 2;
    nodes.push({ id: catId, type: "category", position: { x: CAT_X, y: catCY - CAT_HEIGHT / 2 }, data: { label: catNode.label, phase, color, childCount: catNode.children.length } });
    edges.push({ id: `e-root-${catId}`, source: "root", target: catId, type: "colored", style: { stroke: color, strokeWidth: 1, opacity: 0.5 } });

    const leavesH = catNode.children.length * LEAF_HEIGHT + Math.max(0, catNode.children.length - 1) * LEAF_GAP;
    const leafStartY = catCY - leavesH / 2;
    catNode.children.forEach((child, cIdx) => {
      const leafId = `leaf-${idx}-${cIdx}`;
      nodes.push({ id: leafId, type: "leaf", position: { x: LEAF_X, y: leafStartY + cIdx * (LEAF_HEIGHT + LEAF_GAP) }, data: { label: child.label, color } });
      edges.push({ id: `e-${catId}-${leafId}`, source: catId, target: leafId, type: "colored", style: { stroke: color, strokeWidth: 1, opacity: 0.3 } });
    });
    currentY += groupHeight + CAT_GAP;
  });
  return { nodes, edges };
}

/* ─── Page ─── */
function StrukturPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [rawData, setRawData] = useState<StrukturData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const handleNodeLabelChange = useCallback((id: string, field: string, value: string) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
  }, [setNodes]);

  const handleNodeDelete = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  const toggleEditMode = (mode: boolean) => {
    setIsEditing(mode);
    setNodes((nds) => nds.map((n) => ({
      ...n,
      data: { ...n.data, isEditing: mode, onChange: mode ? handleNodeLabelChange : undefined, onDelete: mode ? handleNodeDelete : undefined }
    })));
  };

  const handleAddCategory = () => {
    const id = `cat-new-${Date.now()}`;
    setNodes((nds) => [...nds, { id, type: "category", position: { x: 500, y: Math.random() * 200 }, data: { label: "New Category", phase: 1, color: "var(--color-signal)", childCount: 0, isEditing: true, onChange: handleNodeLabelChange, onDelete: handleNodeDelete } }]);
  };

  const handleAddLeaf = () => {
    const id = `leaf-new-${Date.now()}`;
    setNodes((nds) => [...nds, { id, type: "leaf", position: { x: 880, y: Math.random() * 200 }, data: { label: "New Feature", color: "var(--color-mist)", isEditing: true, onChange: handleNodeLabelChange, onDelete: handleNodeDelete } }]);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "colored", style: { stroke: "var(--color-signal)", strokeWidth: 1, opacity: 0.5 } }, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (hasStarted || !projectId) return;
    setHasStarted(true);
    const generate = async () => {
      setIsLoading(true);
      try {
        const json = await apiClient.generate.struktur(projectId);
        if (json.error) { setError(json.error); }
        else { setRawData(json); const { nodes: n, edges: e } = buildGraph(json); setNodes(n); setEdges(e); }
      } catch { setError("Failed to connect to the server."); }
      finally { setIsLoading(false); }
    };
    generate();
  }, [hasStarted, setNodes, setEdges, projectId]);

  useEffect(() => {
    const handleProjectUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.appName) {
        const newName = customEvent.detail.appName;
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.type === "root"
              ? { ...node, data: { ...node.data, label: newName } }
              : node
          )
        );
        setRawData((prev) => (prev ? { ...prev, title: newName } : prev));
      }
    };
    window.addEventListener("projectUpdated", handleProjectUpdate);
    return () => window.removeEventListener("projectUpdated", handleProjectUpdate);
  }, [setNodes]);

  const handleSave = async () => {
    if (!projectId) return;
    const rootNode = nodes.find((n) => n.type === "root");
    if (!rootNode) { alert("Root node is missing!"); return; }
    const categoryNodes = nodes.filter((n) => n.type === "category");
    const parsedData: StrukturData = {
      title: String(rootNode.data.label || ""),
      description: String(rootNode.data.description || ""),
      nodes: categoryNodes.map((cat) => {
        const leaves = edges.filter((e) => e.source === cat.id).map((e) => nodes.find((n) => n.id === e.target && n.type === "leaf")).filter(Boolean) as Node[];
        return { id: cat.id, label: String(cat.data.label || ""), phase: Number(cat.data.phase || 1), color: String(cat.data.color || "var(--color-signal)"), children: leaves.map((l) => ({ id: l.id, label: String(l.data.label || "") })) };
      }),
    };
    setIsSaving(true);
    try {
      await apiClient.projects.update({ projectId, strukturData: parsedData, tasksOutdated: true });
      useProjectStore.getState().updateProjectLocally({ strukturData: JSON.stringify(parsedData) });
      setRawData(parsedData);
      const { nodes: n, edges: e } = buildGraph(parsedData);
      setNodes(n);
      setEdges(e);
      setIsEditing(false);
      toast.success("Structure saved!");
    } catch {
      toast.error("Failed to save structure.");
    } finally {
      setIsSaving(false);
    }
  };

  /* Shared button base */
  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "6px 12px",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    cursor: "pointer", border: "1px solid var(--border-hairline)",
    background: "var(--bg-elevated)", color: "var(--fg-secondary)",
    transition: "opacity 0.15s",
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--color-ink)", color: "var(--fg-primary)" }}>

      {/* ── Topbar ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 52, flexShrink: 0,
        borderBottom: "1px solid var(--border-hairline)",
        background: "rgba(16,24,43,0.96)",
        backdropFilter: "blur(12px)",
        zIndex: 50, position: "relative",
      }}>
        {/* Left: Brand & Project Name */}
        <ProjectHeaderBrand projectId={projectId} />

        {/* Step nav */}
        <StepNavbar currentStep="struktur" projectId={projectId} />

        {/* Actions */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          {isEditing ? (
            <>
              <button onClick={() => toggleEditMode(false)} style={{ ...btn, color: "#f87171", borderColor: "rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.08)" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ ...btn, color: "var(--color-circuit)", borderColor: "rgba(79,209,197,0.35)", background: "rgba(79,209,197,0.08)" }}>
                {isSaving ? "Saving…" : "Save & Render"}
              </button>
            </>
          ) : (
            <button onClick={() => toggleEditMode(true)} disabled={isLoading || !rawData} style={{ ...btn, color: "var(--color-mist)", opacity: (isLoading || !rawData) ? 0.4 : 1 }}>
              Edit Mode
            </button>
          )}
          <button
            onClick={() => router.push(`/preview${projectId ? `?projectId=${projectId}` : ""}`)}
            disabled={isLoading || !projectId || isEditing}
            style={{
              ...btn,
              background: "var(--color-signal)",
              color: "var(--color-graphite)",
              borderColor: "var(--color-signal)",
              opacity: (isLoading || !projectId || isEditing) ? 0.4 : 1,
              cursor: (isLoading || !projectId || isEditing) ? "not-allowed" : "pointer",
            }}
          >
            Continue to PRD →
          </button>
        </div>
      </header>

      {/* ── Canvas ── */}
      <div style={{ flex: 1, position: "relative" }}>

        {/* Loading overlay */}
        {isLoading && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 10, background: "var(--color-ink)",
          }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-signal)",
              background: "rgba(255,182,39,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 18,
              animation: "spin 0.8s linear infinite",
            }}>
              <Loader2 size={22} style={{ color: "var(--color-signal)" }} strokeWidth={2} />
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", letterSpacing: "0.06em" }}>
              AI is analyzing architecture…
            </p>
          </div>
        )}

        {/* Error overlay */}
        {error && !isLoading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#f87171", marginBottom: 16 }}>{error}</p>
            <button
              onClick={() => { setHasStarted(false); setError(null); }}
              style={{ ...btn, color: "var(--fg-secondary)" }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Edit toolbar */}
        {isEditing && (
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 8, zIndex: 10,
            background: "rgba(16,24,43,0.95)",
            padding: "10px 16px",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-lg)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-muted)", alignSelf: "center", marginRight: 4 }}>
              Add Node:
            </span>
            <button onClick={handleAddCategory} style={{ ...btn, color: "var(--color-signal)", borderColor: "rgba(255,182,39,0.35)", background: "rgba(255,182,39,0.06)" }}>
              + Category
            </button>
            <button onClick={handleAddLeaf} style={{ ...btn, color: "var(--color-circuit)", borderColor: "rgba(79,209,197,0.35)", background: "rgba(79,209,197,0.06)" }}>
              + Feature
            </button>
          </div>
        )}

        {/* React Flow */}
        {!isLoading && !error && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.2}
            nodesConnectable={isEditing}
            elementsSelectable={isEditing}
            deleteKeyCode={["Backspace", "Delete"]}
          >
            {/* Blueprint dot grid */}
            <Background variant={BackgroundVariant.Dots} gap={40} size={1.5} color="rgba(139,147,167,0.2)" />
            <Controls style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-hairline)" }} />
          </ReactFlow>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .react-flow__controls-button {
          background: var(--bg-elevated) !important;
          border-color: var(--border-hairline) !important;
          color: var(--fg-muted) !important;
          fill: var(--fg-muted) !important;
        }
        .react-flow__controls-button:hover {
          background: var(--bg-base) !important;
          color: var(--fg-primary) !important;
          fill: var(--fg-primary) !important;
        }
        .react-flow__attribution { display: none; }
        .react-flow__panel { font-family: var(--font-mono); }
      `}</style>
    </div>
  );
}

export default function StrukturPage() {
  return (
    <Suspense fallback={<StructureSkeleton />}>
      <StrukturPageContent />
    </Suspense>
  );
}
