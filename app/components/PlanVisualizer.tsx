import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DATABASES, type DatabaseKey } from "@/data/databases";

type ViewMode = "graph" | "grid" | "flame";

export function PlanVisualizer({
  databaseKey,
  plan,
  onBack,
}: {
  databaseKey: DatabaseKey;
  plan: string;
  onBack: () => void;
}) {
  const database = DATABASES[databaseKey];
  const [viewMode, setViewMode] = useState<ViewMode>("graph");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="icon" onClick={onBack}>
          <IconArrowLeft />
        </Button>
        <ToggleGroup
          variant="outline"
          size="lg"
          className="bg-background"
          value={[viewMode]}
          onValueChange={(value) => {
            const [next] = value as ViewMode[];
            if (next) {
              setViewMode(next);
            }
          }}
        >
          <ToggleGroupItem value="graph">Graph</ToggleGroupItem>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="flame">Flame</ToggleGroupItem>
        </ToggleGroup>
        <span className="text-muted-foreground text-sm ml-auto">{database.name}</span>
      </div>
      <div className="rounded-md border border-input bg-secondary p-4 min-h-96">
        <p className="text-muted-foreground text-center py-8">Plan visualization will be rendered here</p>
        <pre className="text-xs text-muted-foreground overflow-auto max-h-[50vh]">{plan}</pre>
      </div>
    </div>
  );
}
