import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export function ColoredEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }: EdgeProps) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curvature: 0.2,
  });
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}
