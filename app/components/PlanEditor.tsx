import { IconArrowBigUpFilled, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DATABASES, type DatabaseKey } from "@/data/databases";

function DatabaseToggle({ selectedDb, onChange }: { selectedDb: DatabaseKey; onChange: (next: DatabaseKey) => void }) {
  return (
    <ToggleGroup
      variant="outline"
      size="lg"
      className="bg-background"
      value={[selectedDb]}
      onValueChange={(value) => {
        const [next] = value as DatabaseKey[];
        if (next) {
          onChange(next);
        }
      }}
    >
      {Object.entries(DATABASES).map(([key, db]) => {
        return (
          <ToggleGroupItem key={key} value={key} aria-label={`Toggle ${db.name}`}>
            {db.name}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

function ExplainSnippet({ databaseKey }: { databaseKey: DatabaseKey }) {
  const { name, explain_query } = DATABASES[databaseKey];
  return (
    <div className="relative">
      <pre className="rounded-md bg-secondary p-2 font-mono text-xs border">
        <code>{explain_query}</code>
      </pre>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-2 dark:hover:bg-input/50"
        onClick={() => navigator.clipboard.writeText(explain_query)}
        aria-label={`Copy ${name} explain command`}
      >
        <IconCopy />
      </Button>
    </div>
  );
}

export function PlanEditor({
  selectedDb,
  onDbChange,
  plans,
  setPlans,
  onSubmit,
}: {
  selectedDb: DatabaseKey;
  onDbChange: (next: DatabaseKey) => void;
  plans: Record<string, string>;
  setPlans: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmit: () => void;
}) {
  const database = DATABASES[selectedDb];
  const plan = plans[selectedDb] ?? "";
  const [examplesByDb, setExamplesByDb] = useState<Partial<Record<DatabaseKey, Record<string, string>>>>({});
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  const setPlan = (value: string) => setPlans((prev) => ({ ...prev, [selectedDb]: value }));

  const examples = examplesByDb[selectedDb];

  const loadExamples = async () => {
    if (examples || isLoadingExamples) return;
    setIsLoadingExamples(true);
    try {
      const loaded = await database.loadExamples();
      setExamplesByDb((prev) => ({ ...prev, [selectedDb]: loaded }));
    } finally {
      setIsLoadingExamples(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4">
      <DatabaseToggle selectedDb={selectedDb} onChange={onDbChange} />
      <ExplainSnippet databaseKey={selectedDb} />
      <div className="group flex flex-1 min-h-0 flex-col overflow-hidden rounded-md border border-input bg-secondary transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <Textarea
          className="flex-1 min-h-0 rounded-none border-0 bg-secondary dark:bg-secondary focus-visible:ring-0 field-sizing-fixed"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />
        <div className="bg-secondary text-secondary-foreground flex w-full items-center justify-between gap-4 border-t border-input px-2 py-2">
          <Select
            key={selectedDb}
            value=""
            onOpenChange={loadExamples}
            onValueChange={(value) => {
              if (!value) return;
              const example = examples?.[value];
              if (example) {
                setPlan(example);
              }
            }}
          >
            <SelectTrigger disabled={isLoadingExamples}>
              <SelectValue placeholder={isLoadingExamples ? "loading..." : "examples"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {database.exampleKeys.map((exampleKey) => (
                  <SelectItem key={exampleKey} value={exampleKey}>
                    {exampleKey}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-4 items-center">
            <span className="text-muted-foreground text-sm">{database.name}</span>
            <Button onClick={onSubmit} disabled={!plan.trim()}>
              <IconArrowBigUpFilled />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
