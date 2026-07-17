"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, LayoutGrid, Loader2, Trash2 } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
import "@xyflow/react/dist/style.css";

/* ─── Types ─── */
interface StrukturChild {
  id: string;
  label: string;
}

interface StrukturNode {
  id: string;
  label: string;
  phase?: number;
  color?: string;
  children: StrukturChild[];
}

interface StrukturData {
  title: string;
  description: string;
  nodes: StrukturNode[];
}

/* ─── Phase color helper ─── */
const PHASE_COLORS: Record<number, { border: string; bg: string; badge: string; badgeBg: string; badgeText: string }> = {
  1: { border: "#6366f1", bg: "rgba(99,102,241,0.08)", badge: "Phase 1 — Core",   badgeBg: "#6366f1", badgeText: "#ffffff" },
  2: { border: "#10b981", bg: "rgba(16,185,129,0.08)", badge: "Phase 2 — Growth", badgeBg: "#10b981", badgeText: "#ffffff" },
  3: { border: "#f97316", bg: "rgba(249,115,22,0.08)",  badge: "Phase 3 — Future", badgeBg: "#f97316", badgeText: "#ffffff" },
};

/* ─── Custom Node: Root ─── */
function RootNode({ id, data }: { id: string; data: any }) {
  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, #1e2538, #252d42)",
        border: "2px solid #6366f1",
        borderRadius: "16px",
        padding: "20px 26px",
        minWidth: "220px",
        maxWidth: "260px",
        boxShadow: "0 0 0 4px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={16} strokeWidth={2.5} color="#818cf8" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#f8fafc", lineHeight: 1.2 }}>
              {data.isEditing ? (
                <input
                  value={data.label}
                  onChange={(e) => data.onChange(id, 'label', e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', outline: 'none', borderBottom: '1px solid #6366f1', width: '100%', padding: 0 }}
                  autoFocus
                />
              ) : data.label}
            </div>
            <div style={{ fontSize: "10px", color: "#6366f1", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "2px" }}>Product Architecture</div>
          </div>
        </div>
        {data.description && (
          <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.55, borderTop: "1px solid rgba(99,102,241,0.2)", paddingTop: "8px" }}>
            {data.description}
          </div>
        )}
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "10px", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", padding: "2px 8px", borderRadius: "8px", fontWeight: 600 }}>
            {data.nodeCount} modules
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={data.isEditing} style={{ background: "#6366f1", border: "2px solid #1e2538", width: "14px", height: "14px", right: "-7px", cursor: data.isEditing ? "crosshair" : "default" }} />
    </>
  );
}

/* ─── Custom Node: Category ─── */
function CategoryNode({ id, data }: { id: string; data: any }) {
  const phaseInfo = PHASE_COLORS[data.phase] || PHASE_COLORS[1];
  const color = data.color || phaseInfo.border;
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={data.isEditing} style={{ background: color, border: "2px solid #161b24", width: "12px", height: "12px", left: "-6px", cursor: data.isEditing ? "crosshair" : "default" }} />
      <div style={{
        background: "#1a2035",
        border: `1.5px solid ${color}`,
        borderRadius: "12px",
        padding: "14px 18px",
        minWidth: "200px",
        maxWidth: "240px",
        boxShadow: `0 0 0 3px ${color}1a, 0 4px 16px rgba(0,0,0,0.3)`,
        position: "relative",
      }}>
        {/* Phase badge & Delete button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "absolute", top: "-11px", left: "14px", right: "14px", pointerEvents: "none" }}>
          <div style={{
            background: phaseInfo.badgeBg, color: phaseInfo.badgeText,
            fontSize: "10.5px", fontWeight: 800, padding: "3px 10px", borderRadius: "10px", letterSpacing: "0.04em",
            boxShadow: `0 3px 10px ${color}40`, pointerEvents: "auto"
          }}>
            {phaseInfo.badge}
          </div>
          {data.isEditing && (
            <div 
              onClick={() => data.onDelete(id)}
              style={{ background: "#f87171", color: "white", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(248,113,113,0.5)", pointerEvents: "auto", marginTop: "2px" }}
              title="Hapus Kategori"
            >
              <Trash2 size={11} strokeWidth={2.5} />
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LayoutGrid size={14} strokeWidth={2} color={color} />
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3, flex: 1 }}>
            {data.isEditing ? (
              <input
                value={data.label}
                onChange={(e) => data.onChange(id, 'label', e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', outline: 'none', borderBottom: `1px solid ${color}`, width: '100%', padding: 0 }}
                autoFocus
              />
            ) : data.label}
          </div>
        </div>
        <div style={{ marginTop: "8px", fontSize: "10px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: color }} />
          {data.childCount} sub-features
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={data.isEditing} style={{ background: color, border: "2px solid #161b24", width: "12px", height: "12px", right: "-6px", cursor: data.isEditing ? "crosshair" : "default" }} />
    </>
  );
}

/* ─── Custom Node: Leaf (individual child feature) ─── */
function LeafNode({ id, data }: { id: string; data: any }) {
  const color = data.color || "#475569";
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={data.isEditing} style={{ background: color, border: "2px solid #161b24", width: "10px", height: "10px", left: "-5px", opacity: 0.7, cursor: data.isEditing ? "crosshair" : "default" }} />
      <div style={{
        background: "#141928",
        border: `1px solid ${color}40`,
        borderRadius: "8px",
        padding: "7px 12px",
        minWidth: "160px",
        maxWidth: "220px",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.8 }} />
        <span style={{ fontSize: "11.5px", color: "#cbd5e1", fontWeight: 500, lineHeight: 1.35, flex: 1 }}>
          {data.isEditing ? (
            <input
              value={data.label}
              onChange={(e) => data.onChange(id, 'label', e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', outline: 'none', borderBottom: `1px solid ${color}`, width: '100%', padding: 0 }}
              autoFocus
            />
          ) : data.label}
        </span>
        {data.isEditing && (
          <div 
            onClick={() => data.onDelete(id)}
            style={{ color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}
            title="Hapus Fitur"
          >
            <Trash2 size={13} strokeWidth={2} />
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Custom Edge: Smooth Bezier with color ─── */
function ColoredEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, curvature: 0.15 });
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}

const nodeTypes = {
  root: RootNode,
  category: CategoryNode,
  leaf: LeafNode,
};

const edgeTypes = {
  colored: ColoredEdge,
};

/* ─── Layout Builder — Tree Fan-out ─── */
function buildGraph(data: StrukturData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // ── Sizing constants ──
  const ROOT_X = 50;
  const CAT_X = 500;
  const LEAF_X = 880;

  // Calculate total vertical space needed
  const CAT_HEIGHT = 80;    // height of a category node
  const LEAF_HEIGHT = 42;   // height of each leaf node
  const LEAF_GAP = 24;      // gap between leaves
  const CAT_GAP = 100;      // minimum gap between category groups

  // Pre-calculate group heights
  type GroupMeta = { catNode: StrukturNode; groupHeight: number; color: string; phase: number; };
  const groups: GroupMeta[] = data.nodes.map((catNode, idx) => {
    const childCount = catNode.children.length;
    const leavesHeight = childCount * LEAF_HEIGHT + Math.max(0, childCount - 1) * LEAF_GAP;
    const groupHeight = Math.max(CAT_HEIGHT, leavesHeight);
    const defaultColors = ["#6366f1","#3b82f6","#06b6d4","#10b981","#8b5cf6","#f59e0b","#f97316"];
    const color = catNode.color || defaultColors[idx % defaultColors.length];
    const phase = catNode.phase || Math.min(Math.floor(idx / 2) + 1, 3);
    return { catNode, groupHeight, color, phase };
  });

  const totalHeight = groups.reduce((sum, g) => sum + g.groupHeight, 0) + Math.max(0, groups.length - 1) * CAT_GAP;

  // Root node — centered vertically
  nodes.push({
    id: "root",
    type: "root",
    position: { x: ROOT_X, y: (totalHeight / 2) - 70 },
    data: { label: data.title, description: data.description, nodeCount: data.nodes.length },
  });

  let currentY = 0;

  groups.forEach(({ catNode, groupHeight, color, phase }, idx) => {
    const catId = `cat-${idx}`;
    const catCenterY = currentY + groupHeight / 2;

    // Category node — centered in its group
    nodes.push({
      id: catId,
      type: "category",
      position: { x: CAT_X, y: catCenterY - CAT_HEIGHT / 2 },
      data: { label: catNode.label, phase, color, childCount: catNode.children.length },
    });

    // Edge: root → category
    edges.push({
      id: `e-root-${catId}`,
      source: "root",
      target: catId,
      type: "colored",
      style: { stroke: color, strokeWidth: 1.5, opacity: 0.5 },
    });

    // Leaf nodes — fan out from category center
    const childCount = catNode.children.length;
    const leavesHeight = childCount * LEAF_HEIGHT + Math.max(0, childCount - 1) * LEAF_GAP;
    const leafStartY = catCenterY - leavesHeight / 2;

    catNode.children.forEach((child, cIdx) => {
      const leafId = `leaf-${idx}-${cIdx}`;
      const leafY = leafStartY + cIdx * (LEAF_HEIGHT + LEAF_GAP);

      nodes.push({
        id: leafId,
        type: "leaf",
        position: { x: LEAF_X, y: leafY },
        data: { label: child.label, color },
      });

      // Edge: category → leaf
      edges.push({
        id: `e-${catId}-${leafId}`,
        source: catId,
        target: leafId,
        type: "colored",
        style: { stroke: color, strokeWidth: 1, opacity: 0.35 },
      });
    });

    currentY += groupHeight + CAT_GAP;
  });

  return { nodes, edges };
}

/* ─── StepNavbar ─── */
function StepNavbar({ currentStep, projectId }: { currentStep: "struktur" | "prd" | "task", projectId: string | null }) {
  const steps = [
    { id: "struktur", label: "Struktur", href: `/struktur${projectId ? `?projectId=${projectId}` : ''}` },
    { id: "prd", label: "PRD", href: `/preview${projectId ? `?projectId=${projectId}` : ''}` },
    { id: "task", label: "Task", href: `/task${projectId ? `?projectId=${projectId}` : ''}` },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {steps.map((step, i) => {
        const isDone = steps.findIndex(s => s.id === currentStep) > i;
        const isActive = step.id === currentStep;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <Link href={isDone || isActive ? step.href : "#"} style={{ textDecoration: "none", pointerEvents: isDone || isActive ? "auto" : "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "4px 10px", borderRadius: "6px",
                background: "transparent",
                transition: "background 0.2s",
              }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 700, flexShrink: 0,
                  background: isDone || isActive ? "#6366f1" : "transparent",
                  color: isDone || isActive ? "white" : "#64748b",
                  border: isDone || isActive ? "2px solid #6366f1" : "1.5px solid rgba(148,163,184,0.3)",
                  boxSizing: "border-box",
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "12px", fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#e8eaf6" : isDone ? "#818cf8" : "#64748b",
                  letterSpacing: "0.01em",
                }}>
                  {step.label}
                </span>
              </div>
            </Link>
            {i < steps.length - 1 && (
              <div style={{
                width: "28px", height: "1.5px", flexShrink: 0,
                background: isDone
                  ? "linear-gradient(90deg, #6366f1, #818cf8)"
                  : "rgba(148,163,184,0.2)",
                borderRadius: "2px",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ─── */
function StrukturPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [rawData, setRawData] = useState<StrukturData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJson, setEditedJson] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const handleNodeLabelChange = useCallback((id: string, field: string, value: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, [field]: value } };
        }
        return n;
      })
    );
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
    const newNode: Node = {
      id,
      type: "category",
      position: { x: 500, y: Math.random() * 200 }, 
      data: { label: "Kategori Baru", phase: 1, color: "#6366f1", childCount: 0, isEditing: true, onChange: handleNodeLabelChange, onDelete: handleNodeDelete }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleAddLeaf = () => {
    const id = `leaf-new-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "leaf",
      position: { x: 880, y: Math.random() * 200 },
      data: { label: "Fitur Baru", color: "#64748b", isEditing: true, onChange: handleNodeLabelChange, onDelete: handleNodeDelete }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'colored', style: { stroke: '#6366f1', strokeWidth: 1.5, opacity: 0.5 } }, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (hasStarted || !projectId) return;
    setHasStarted(true);

    const generate = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/generate/struktur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) { setError("Gagal membuat struktur."); return; }
        const json = await res.json();
        if (json.error) {
          setError(json.error);
        } else {
          setRawData(json);
          const { nodes: n, edges: e } = buildGraph(json);
          setNodes(n);
          setEdges(e);
        }
      } catch {
        setError("Koneksi ke server gagal.");
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [hasStarted, setNodes, setEdges, projectId]);

  const handleSave = async () => {
    if (!projectId) return;
    
    const rootNode = nodes.find(n => n.type === 'root');
    if (!rootNode) {
      alert("Root node hilang! Tidak bisa menyimpan.");
      return;
    }

    const categoryNodes = nodes.filter(n => n.type === 'category');
    
    const parsedData: StrukturData = {
      title: String(rootNode.data.label || ""),
      description: String(rootNode.data.description || ""),
      nodes: categoryNodes.map(cat => {
        const connectedLeaves = edges
          .filter(e => e.source === cat.id)
          .map(e => nodes.find(n => n.id === e.target && n.type === 'leaf'))
          .filter(Boolean) as Node[];

        return {
          id: cat.id,
          label: String(cat.data.label || ""),
          phase: Number(cat.data.phase || 1),
          color: String(cat.data.color || "#6366f1"),
          children: connectedLeaves.map(leaf => ({ id: leaf.id, label: String(leaf.data.label || "") }))
        };
      })
    };

    setIsSaving(true);
    try {
      const res = await fetch("/api/projects/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, strukturData: parsedData, tasksOutdated: true }),
      });
      if (res.ok) {
        setRawData(parsedData);
        const { nodes: n, edges: e } = buildGraph(parsedData);
        setNodes(n);
        setEdges(e);
        setIsEditing(false);
      } else {
        alert("Gagal menyimpan Struktur.");
      }
    } catch (e) {
      alert("Error koneksi saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
    cursor: "pointer", transition: "opacity 0.15s",
    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(148,163,184,0.2)", color: "#cbd5e1",
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0f172a", color: "#e8eaf6" }}>

      {/* ── Topbar ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "52px", flexShrink: 0,
        borderBottom: "1px solid #1e293b",
        background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
        zIndex: 50, position: "relative",
      }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "linear-gradient(135deg, #6366f1, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", color: "white" }}>P</div>
            <span style={{ fontWeight: 700, background: "linear-gradient(135deg, #818cf8, #60a5fa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Piardify</span>
          </Link>
        </div>

        <StepNavbar currentStep="struktur" projectId={projectId} />

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
          {isEditing ? (
            <>
              <button onClick={() => toggleEditMode(false)} style={{ ...btnBase, color: "#f87171", borderColor: "#f8717140", background: "rgba(248,113,113,0.1)" }}>Batal</button>
              <button onClick={handleSave} disabled={isSaving} style={{ ...btnBase, color: "#4ade80", borderColor: "#4ade8040", background: "rgba(74,222,128,0.1)" }}>
                {isSaving ? "Menyimpan..." : "Simpan & Render"}
              </button>
            </>
          ) : (
            <button onClick={() => toggleEditMode(true)} disabled={isLoading || !rawData} style={{ ...btnBase, color: "#a78bfa", borderColor: "#a78bfa40", background: "rgba(167,139,250,0.1)" }}>
              Edit Mode
            </button>
          )}
          <button
            onClick={() => router.push(`/preview${projectId ? `?projectId=${projectId}` : ''}`)}
            disabled={isLoading || !projectId || isEditing}
            style={{
              padding: "8px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              color: "white", border: "none", cursor: (isLoading || !projectId || isEditing) ? "not-allowed" : "pointer",
              opacity: (isLoading || !projectId || isEditing) ? 0.5 : 1,
              boxShadow: "0 0 20px rgba(99,102,241,0.35)",
            }}
          >
            Lanjutkan ke PRD →
          </button>
        </div>
      </header>

      {/* ── React Flow Canvas ── */}
      <div style={{ flex: 1, position: "relative" }}>
        {isLoading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", zIndex: 10,
            background: "#0f172a",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              boxShadow: "0 0 32px rgba(99,102,241,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px", animation: "spin 1s linear infinite",
            }}>
              <Loader2 size={24} color="white" strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: "14px", color: "#64748b" }}>AI sedang menganalisis struktur aplikasi...</p>
          </div>
        )}

        {error && !isLoading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
            <button
              onClick={() => { setHasStarted(false); setError(null); }}
              style={{ padding: "10px 24px", borderRadius: "10px", background: "#1e293b", border: "1px solid rgba(148,163,184,0.2)", color: "#94a3b8", cursor: "pointer" }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {isEditing && (
          <div style={{ position: "absolute", top: 20, left: '50%', transform: 'translateX(-50%)', display: "flex", gap: "10px", zIndex: 10, background: "rgba(15,23,42,0.9)", padding: "10px 20px", borderRadius: "12px", border: "1px solid #334155", backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            <div style={{ color: "#94a3b8", fontSize: "12px", marginRight: "8px", alignSelf: "center", fontWeight: 600 }}>Tambahkan Node:</div>
            <button onClick={handleAddCategory} style={{ ...btnBase, background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.1))", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.4)" }}>+ Kategori Baru</button>
            <button onClick={handleAddLeaf} style={{ ...btnBase, background: "linear-gradient(135deg, rgba(71,85,105,0.4), rgba(71,85,105,0.2))", color: "#cbd5e1", border: "1px solid rgba(148,163,184,0.3)" }}>+ Fitur Baru</button>
          </div>
        )}

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
            <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#334155" />
            <Controls style={{ background: "#1e293b", border: "1px solid #334155", fill: "#94a3b8" }} />
          </ReactFlow>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .react-flow__controls-button {
          background: #1e293b !important;
          border-color: #334155 !important;
          color: #94a3b8 !important;
          fill: #94a3b8 !important;
        }
        .react-flow__controls-button:hover {
          background: #334155 !important;
        }
        .react-flow__attribution {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default function StrukturPage() {
  return (
    <Suspense fallback={<div style={{height: "100vh", background: "#0f172a"}} />}>
      <StrukturPageContent />
    </Suspense>
  );
}
