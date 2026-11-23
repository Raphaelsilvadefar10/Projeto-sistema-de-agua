import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, Panel, Tank } from "@/components/AppShell";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";
import { TANK_CAPACITY_L } from "@/lib/simulation-core";

export const Route = createFileRoute("/reservatorios")({
  head: pageHead("Reservatórios", "Representação visual e níveis simulados dos dois reservatórios de água da chuva."),
  component: Page,
});

function Page() {
  const { state } = useSim();
  const l = (p: number) => `${((p / 100) * TANK_CAPACITY_L).toFixed(0)} de ${TANK_CAPACITY_L} L`;
  return (
    <>
      <PageHeader title="Reservatórios" subtitle="O sensor de nível monitora o reservatório 1. Quando o limite é atingido, a bomba transfere a água para a caixa-d'água." />
      <Panel className="flex flex-col items-center justify-center gap-8 py-10 sm:flex-row sm:gap-12">
        <Tank label="Reservatório 1 — Captação" level={state.r1} sub={l(state.r1)} />
        <div className="flex flex-col items-center gap-2 text-sm">
          <ArrowRight className={`h-10 w-10 rotate-90 sm:rotate-0 ${state.pumpOn ? "animate-pulse text-success" : "text-muted-foreground"}`} />
          <span className={state.pumpOn ? "font-medium text-success" : "text-muted-foreground"}>{state.pumpOn ? "Transferindo" : "Bomba parada"}</span>
        </div>
        <Tank label="Reservatório 2 — Caixa-d'água" level={state.r2} sub={l(state.r2)} />
      </Panel>
    </>
  );
}
