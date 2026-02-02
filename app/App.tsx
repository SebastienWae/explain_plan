import {
  IconArrowBigUpFilled,
  IconBrandGithub,
  IconBrandX,
  IconCopy,
  IconExternalLink,
  IconInfoCircle,
  IconSchema,
} from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DATABASES, type DatabaseKey } from "@/data/databases";

function Background() {
  return (
    <div
      className="absolute inset-0 z-0 bg-background"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 25%, #222222 1px, transparent 1px), radial-gradient(circle at 75% 75%, #111111 1px, transparent 1px)",
        backgroundSize: "10px 10px",
        imageRendering: "pixelated",
      }}
    />
  );
}

function SocialLinks() {
  return (
    <div className="absolute right-4 top-4 flex items-center gap-4">
      <ButtonGroup>
        <Button
          variant="secondary"
          size="icon"
          nativeButton={false}
          render={
            <a href="https://github.com/SebastienWae/explain" rel="noreferrer" target="_blank">
              <IconBrandGithub />
            </a>
          }
        />
        <Button
          variant="secondary"
          size="icon"
          nativeButton={false}
          render={
            <a href="https://x.com/Seb_Wae" rel="noreferrer" target="_blank">
              <IconBrandX />
            </a>
          }
        />
      </ButtonGroup>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <IconSchema className="size-6" />
      </div>
      <h1 className="text-3xl font-semibold">EXPLAIN PLAN VISUALIZER</h1>
    </div>
  );
}

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

function QueryEditor({
  databaseKey,
  plans,
  setPlans,
}: {
  databaseKey: DatabaseKey;
  plans: Record<string, string>;
  setPlans: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const database = DATABASES[databaseKey];
  const plan = plans[databaseKey] ?? "";
  const [examplesByDb, setExamplesByDb] = useState<Partial<Record<DatabaseKey, Record<string, string>>>>({});
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  const setPlan = (value: string) => setPlans((prev) => ({ ...prev, [databaseKey]: value }));

  const examples = examplesByDb[databaseKey];

  const loadExamples = async () => {
    if (examples || isLoadingExamples) return;
    setIsLoadingExamples(true);
    try {
      const loaded = await database.loadExamples();
      setExamplesByDb((prev) => ({ ...prev, [databaseKey]: loaded }));
    } finally {
      setIsLoadingExamples(false);
    }
  };

  return (
    <div className="group rounded-md border border-input bg-secondary overflow-hidden transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
      <Textarea
        className="min-h-96 max-h-[60vh] rounded-none border-0 bg-secondary dark:bg-secondary focus-visible:ring-0"
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
      />
      <div className="bg-secondary text-secondary-foreground flex w-full items-center justify-between gap-4 border-t border-input px-2 py-2">
        <Select
          key={databaseKey}
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
          <Button>
            <IconArrowBigUpFilled />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PrivacyNotice() {
  return (
    <div className="flex justify-between items-center rounded-md bg-primary text-primary-foreground p-2 text-xs border">
      <span className="inline-flex items-center gap-2 text-sm">
        <IconInfoCircle />
        Everything is done in-browser, your data never leaves your device.
      </span>
      <Button
        variant="secondary"
        nativeButton={false}
        render={
          <a href="https://github.com/SebastienWae/explain" rel="noreferrer" target="_blank">
            <IconExternalLink />
            run locally
          </a>
        }
      />
    </div>
  );
}

function App() {
  const [selectedDb, setSelectedDb] = useState<DatabaseKey>("duckdb");
  const [plans, setPlans] = useState<Record<string, string>>({});
  return (
    <div className="min-h-screen w-full relative">
      <Background />
      <div className="relative flex flex-col w-full min-h-svh items-center justify-start px-4 pt-16">
        <SocialLinks />
        <div className="flex flex-col gap-4 w-full max-w-2xl xl:max-w-4xl">
          <Header />
          <DatabaseToggle selectedDb={selectedDb} onChange={setSelectedDb} />
          <ExplainSnippet databaseKey={selectedDb} />
          <QueryEditor databaseKey={selectedDb} plans={plans} setPlans={setPlans} />
          <PrivacyNotice />
        </div>
      </div>
    </div>
  );
}

export default App;
