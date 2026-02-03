import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { formatBytes, formatCount, formatMs } from "@/lib/plan/format";
import type { NormalizedPlanNode, PlanStats } from "@/lib/plan/normalize";
import { cn } from "@/lib/utils";

type PlanFlowNode = Node<{ node: NormalizedPlanNode; stats: PlanStats }, "plan">;

type MetricRow = {
  label: string;
  value: number | undefined;
  format: (value: number | undefined) => string;
  secondary?: string;
};

function splitLabel(label: string) {
  const start = label.indexOf(" (");
  const end = label.endsWith(")") ? label.length - 1 : -1;
  if (start === -1 || end <= start) {
    return { title: label };
  }
  return {
    title: label.slice(0, start),
    subtitle: label.slice(start + 2, end),
  };
}

function formatPercent(value: number) {
  if (value === 0) return "0.00%";
  if (value >= 100) return `${Math.round(value)}%`;
  if (value >= 10) return `${value.toFixed(1)}%`;
  if (value >= 1) return `${value.toFixed(2)}%`;
  if (value >= 0.1) return `${value.toFixed(3)}%`;
  return `${value.toFixed(4)}%`;
}

export function PlanNode({ data, selected }: NodeProps<PlanFlowNode>) {
  const { node, stats } = data;
  const { metrics } = node;
  const selfTime = metrics.exclusiveTimeMs;
  const timePercent =
    selfTime !== undefined && stats.executionTimeMs
      ? Math.min(100, (selfTime / stats.executionTimeMs) * 100)
      : undefined;
  const costValue = metrics.cost ?? metrics.totalCost;
  const costPercent =
    costValue !== undefined && stats.maxTotalCost ? Math.min(100, (costValue / stats.maxTotalCost) * 100) : undefined;

  const { title, subtitle } = splitLabel(node.label);

  const metricCandidates: MetricRow[] = [
    {
      label: "time",
      value: selfTime,
      format: formatMs,
      secondary: timePercent !== undefined ? formatPercent(timePercent) : undefined,
    },
    {
      label: "cost",
      value: costValue,
      format: formatCount,
      secondary: costPercent !== undefined ? formatPercent(costPercent) : undefined,
    },
    { label: "buffers", value: metrics.bufferBytes, format: formatBytes },
  ];
  const primaryMetrics = metricCandidates.filter(
    (metric): metric is MetricRow & { value: number } => metric.value !== undefined,
  );

  return (
    <div
      className={cn(
        "relative h-fit w-64 overflow-hidden rounded-lg border border-white/10 bg-secondary/90 px-3.5 py-3 text-xs shadow-lg shadow-black/40 ring-1 ring-white/10 transition",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 h-1 w-1 border-0 bg-transparent" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 h-1 w-1 border-0 bg-transparent" />
      <div className="flex items-start gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</div>
          {subtitle && <div className="truncate text-[11px] text-muted-foreground/80">{subtitle}</div>}
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-md border border-white/10 bg-black/25 shadow-inner shadow-black/40">
        {primaryMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn("flex items-center justify-between gap-2 px-3 py-2", index > 0 && "border-t border-white/10")}
          >
            <span className="text-[11px] text-muted-foreground">{metric.label}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-semibold tabular-nums tracking-tight text-foreground">
                {metric.format(metric.value)}
              </span>
              {metric.secondary && (
                <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80">
                  {metric.secondary}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
