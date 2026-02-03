import { IconBrandGithub, IconBrandX, IconExternalLink, IconInfoCircle, IconSchema } from "@tabler/icons-react";
import { useState } from "react";
import { PlanEditor } from "@/components/PlanEditor";
import { PlanVisualizer } from "@/components/PlanVisualizer";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { DatabaseKey } from "@/data/databases";

type View = "editor" | "visualizer";

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
  const [selectedDb, setSelectedDb] = useState<DatabaseKey>("postgresql");
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [view, setView] = useState<View>("editor");

  const currentPlan = plans[selectedDb] ?? "";

  return (
    <div className="min-h-svh w-full relative">
      <Background />
      <div className="relative flex min-h-svh w-full flex-col px-4 py-4">
        <header className="flex items-center justify-between gap-4">
          <Header />
          <SocialLinks />
        </header>
        <main className="mt-4 flex w-full flex-1 min-h-0 flex-col gap-4">
          {view === "editor" ? (
            <PlanEditor
              selectedDb={selectedDb}
              onDbChange={setSelectedDb}
              plans={plans}
              setPlans={setPlans}
              onSubmit={() => setView("visualizer")}
            />
          ) : (
            <PlanVisualizer databaseKey={selectedDb} plan={currentPlan} onBack={() => setView("editor")} />
          )}
        </main>
        <footer className="mt-4">
          <PrivacyNotice />
        </footer>
      </div>
    </div>
  );
}

export default App;
