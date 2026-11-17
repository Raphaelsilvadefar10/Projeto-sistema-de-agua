import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, Sun } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/AppShell";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";

export const Route = createFileRoute("/energia")({
  head: pageHead("Energia solar", "Geração do painel solar e nível de carga simulado das baterias."),
  component: Page,
});

function Page() {
  const { state, series } = useSim();
  return (
    <>
      <PageHeader title="Energia solar" subtitle="O painel solar carrega as baterias que alimentam o Arduino, o sensor e a bomba." />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="flex items-center gap-6">
          <Sun className={`h-20 w-20 text-warning ${state.solarW > 50 ? "spin-slow" : "opacity-60"}`} />
          <div><div className="text-sm text-muted-foreground">Painel solar</div>
            <div className="font-display text-4xl font-bold">{state.solarW.toFixed(0)} W</div>
            <div className="text-xs text-muted-foreground">{state.raining ? "Céu nublado — geração reduzida" : "Boa incidência solar"}</div></div>
        </Panel>
        <Panel className="flex items-center gap-6">
          <div className="relative h-20 w-12 rounded-md border-4 border-foreground/70 p-1">
            <div className="absolute -top-2 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-t bg-foreground/70" />
            <div className="absolute inset-x-1 bottom-1 rounded-sm bg-success transition-all duration-1000" style={{ height: `calc(${state.battery}% - 8px)` }} />
          </div>
          <div><div className="flex items-center gap-1 text-sm text-muted-foreground"><BatteryCharging className="h-4 w-4" /> Bateria</div>
            <div className="font-display text-4xl font-bold">{state.battery.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">{state.pumpOn ? "Bomba consumindo energia" : "Carregando"}</div></div>
        </Panel>
      </div>
      <Panel className="mt-4">
        <h2 className="font-display font-semibold">Carga e geração (simulado)</h2>
        <div className="mt-4 h-64"><ResponsiveContainer><LineChart data={series}>
          <XAxis dataKey="t" hide /><YAxis domain={[0, 100]} fontSize={12} stroke="var(--muted-foreground)" /><Tooltip />
          <Line dataKey="battery" name="Bateria %" stroke="var(--chart-2)" dot={false} strokeWidth={2} isAnimationActive={false} />
          <Line dataKey="solar" name="Solar W" stroke="var(--chart-3)" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart></ResponsiveContainer></div>
      </Panel>
    </>
  );
}
