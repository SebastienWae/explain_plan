import dagre from "@dagrejs/dagre";
import {
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
  ReactFlow,
} from "@xyflow/react";
import { useMemo } from "react";
import { CteGroupNode } from "@/components/plan/CteGroupNode";
import { PlanNode } from "@/components/plan/PlanNode";
import { formatCount } from "@/lib/plan/format";
import type { NormalizedPlanGraph, NormalizedPlanNode, PlanEdge } from "@/lib/plan/normalize";

const NODE_WIDTH = 240;
const NODE_HEIGHT = 144;
const GROUP_PADDING = 32;
const GROUP_HEADER_HEIGHT = 28;

const EDGE_COLOR = "var(--muted-foreground)";

type CteGroupData = {
  label: string;
};

type LayoutEdge = {
  source: string;
  target: string;
};

type NodeSize = {
  width: number;
  height: number;
};

function layoutNodes(nodes: Node[], edges: LayoutEdge[], sizeById?: Map<string, NodeSize>) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 90, marginx: 20, marginy: 20 });

  for (const node of nodes) {
    const size = sizeById?.get(node.id) ?? { width: NODE_WIDTH, height: NODE_HEIGHT };
    g.setNode(node.id, size);
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const layout = g.node(node.id);
    if (!layout) return node;
    const size = sizeById?.get(node.id) ?? { width: NODE_WIDTH, height: NODE_HEIGHT };
    return {
      ...node,
      position: {
        x: layout.x - size.width / 2,
        y: layout.y - size.height / 2,
      },
    };
  });
}

function sanitizeGroupId(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return cleaned || "cte";
}

type CteGroupLayout = {
  name: string;
  groupId: string;
  width: number;
  height: number;
  childPositions: Map<string, { x: number; y: number }>;
  childIds: string[];
};

function buildCteGroupLayouts(nodes: Node[], edges: PlanEdge[], graph: NormalizedPlanGraph) {
  const entries = Object.entries(graph.cteGroups ?? {});
  if (!entries.length) {
    return { groups: [] as CteGroupLayout[], groupedIds: new Set<string>() };
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const groups: CteGroupLayout[] = [];
  const groupedIds = new Set<string>();
  let groupIndex = 0;

  for (const [cteName, nodeIds] of entries) {
    const childIds = nodeIds.filter((id) => nodeById.has(id));
    if (!childIds.length) continue;

    const childIdSet = new Set(childIds);
    const childNodes = childIds
      .map((id) => nodeById.get(id))
      .filter(Boolean)
      .map((node) => ({
        ...node,
        position: { x: 0, y: 0 },
      })) as Node[];
    const childEdges = edges.filter((edge) => childIdSet.has(edge.source) && childIdSet.has(edge.target));
    const laidOutChildren = layoutNodes(childNodes, childEdges);

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const child of laidOutChildren) {
      minX = Math.min(minX, child.position.x);
      minY = Math.min(minY, child.position.y);
      maxX = Math.max(maxX, child.position.x + NODE_WIDTH);
      maxY = Math.max(maxY, child.position.y + NODE_HEIGHT);
    }

    const width = maxX - minX + GROUP_PADDING * 2;
    const height = maxY - minY + GROUP_PADDING * 2 + GROUP_HEADER_HEIGHT * 2;
    const groupId = `cte-${sanitizeGroupId(cteName)}-${groupIndex++}`;
    const childPositions = new Map<string, { x: number; y: number }>();

    for (const child of laidOutChildren) {
      childPositions.set(child.id, {
        x: child.position.x - minX + GROUP_PADDING,
        y: child.position.y - minY + GROUP_PADDING + GROUP_HEADER_HEIGHT,
      });
    }

    for (const id of childIds) {
      groupedIds.add(id);
    }

    groups.push({
      name: cteName,
      groupId,
      width,
      height,
      childPositions,
      childIds,
    });
  }

  return { groups, groupedIds };
}

function buildFlowNodes(graph: NormalizedPlanGraph) {
  const baseNodes: Node[] = graph.nodes.map((node) => ({
    id: node.id,
    type: "plan",
    data: { node, stats: graph.stats },
    position: { x: 0, y: 0 },
    draggable: false,
  }));

  const { groups, groupedIds } = buildCteGroupLayouts(baseNodes, graph.edges, graph);
  if (!groups.length) {
    return layoutNodes(baseNodes, graph.edges);
  }

  const groupNodes: Node<CteGroupData>[] = groups.map((group) => ({
    id: group.groupId,
    type: "cteGroup",
    data: { label: group.name },
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: false,
    style: { width: group.width, height: group.height, zIndex: 0 },
  }));

  const ungroupedNodes = baseNodes.filter((node) => !groupedIds.has(node.id));

  const groupIdByChild = new Map<string, string>();
  for (const group of groups) {
    for (const childId of group.childIds) {
      groupIdByChild.set(childId, group.groupId);
    }
  }

  const mainEdges: LayoutEdge[] = [];
  const edgeKeys = new Set<string>();
  for (const edge of graph.edges) {
    const source = groupIdByChild.get(edge.source) ?? edge.source;
    const target = groupIdByChild.get(edge.target) ?? edge.target;
    if (source === target) continue;
    const key = `${source}->${target}`;
    if (edgeKeys.has(key)) continue;
    edgeKeys.add(key);
    mainEdges.push({ source, target });
  }

  const sizeById = new Map<string, NodeSize>(
    groups.map((group) => [group.groupId, { width: group.width, height: group.height }]),
  );
  const mainNodes = [...groupNodes, ...ungroupedNodes];
  const mainLayout = layoutNodes(mainNodes, mainEdges, sizeById);
  const mainPositionById = new Map(mainLayout.map((node) => [node.id, node.position]));

  const laidOutGroups = groupNodes.map((group) => ({
    ...group,
    position: mainPositionById.get(group.id) ?? group.position,
  }));

  const laidOutUngrouped = ungroupedNodes.map((node) => ({
    ...node,
    position: mainPositionById.get(node.id) ?? node.position,
  }));

  const groupedChildren: Node[] = [];
  const baseById = new Map(baseNodes.map((node) => [node.id, node]));
  for (const group of groups) {
    for (const childId of group.childIds) {
      const base = baseById.get(childId);
      const position = group.childPositions.get(childId);
      if (!base || !position) continue;
      groupedChildren.push({
        ...base,
        parentId: group.groupId,
        extent: "parent",
        position,
      });
    }
  }

  return [...laidOutGroups, ...laidOutUngrouped, ...groupedChildren];
}

function buildFlowEdges(edges: PlanEdge[], graph: NormalizedPlanGraph) {
  const maxRows = graph.stats.maxRows ?? 0;
  return edges.map((edge): Edge => {
    const isCte = edge.kind === "cte";
    const ratio = !isCte && maxRows ? Math.min(1, (edge.rows ?? 0) / maxRows) : 0;
    const strokeWidth = isCte ? 1.25 : 2 + ratio * 9.5;
    const label = !isCte && edge.rows ? `${formatCount(edge.rows)} rows` : undefined;
    const stroke = EDGE_COLOR;

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: false,
      label,
      labelStyle: { fontSize: 10, fill: "var(--foreground)" },
      labelBgStyle: {
        fill: "var(--card)",
        stroke: "var(--border)",
        strokeWidth: 1,
      },
      labelBgPadding: [4, 3],
      labelBgBorderRadius: 6,
      style: {
        strokeWidth,
        stroke,
        strokeOpacity: isCte ? 0.45 : 0.9,
        strokeDasharray: isCte ? "6 4" : undefined,
      },
    };
  });
}

function isPlanNode(node: Node): node is Node<{ node: NormalizedPlanNode }, "plan"> {
  return node.type === "plan";
}

export function PlanGraph({
  graph,
  selectedNodeId,
  onSelectNode,
}: {
  graph: NormalizedPlanGraph;
  selectedNodeId?: string;
  onSelectNode: (nodeId?: string) => void;
}) {
  const nodeTypes: NodeTypes = {
    plan: PlanNode,
    cteGroup: CteGroupNode,
  };

  const layout = useMemo(() => {
    return {
      nodes: buildFlowNodes(graph),
      edges: buildFlowEdges(graph.edges, graph),
    };
  }, [graph]);

  const nodes = useMemo(
    () =>
      layout.nodes.map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
      })),
    [layout.nodes, selectedNodeId],
  );

  const edges = layout.edges;

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    if (isPlanNode(node)) {
      onSelectNode(node.id);
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full overflow-hidden rounded-md border border-input bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        onNodeClick={handleNodeClick}
        onPaneClick={() => onSelectNode(undefined)}
        colorMode="dark"
        minZoom={0.2}
      >
        <Controls showInteractive={false} />
        <Background color="bg-background" />
      </ReactFlow>
    </div>
  );
}
