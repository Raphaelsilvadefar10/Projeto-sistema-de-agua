import { createFileRoute } from "@tanstack/react-router";
import { Battery, CloudRain, Droplets, Power, ShieldCheck, Sun } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/AppShell";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";

export const Route = createFileRoute("/")({
  head: pageHead("Dashboard", "Visão geral simulada dos reservatórios, bomba e bateria do sistema de água da chuva."),
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, hint, tone = "primary" }: { icon: typeof Droplets; label: string; value: string; hint: string; tone?: "primary" | "success" | "warning" }) {
  const tones = { primary: "bg-primary/10 text-primary", success: "bg-success/15 text-success", warning: "bg-warning/20 text-warning" };
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </Panel>
  );
}

function Dashboard() {
  const { state, series, settings } = useSim();
  const ok = state.battery > 20;
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Situação geral do sistema de captação, armazenamento e transferência de água da chuva." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CloudRain} label="Reservatório 1 (captação)" value={`${state.r1.toFixed(0)}%`} hint={state.raining ? "Recebendo chuva" : "Sem chuva no momento"} />
        <Stat icon={Droplets} label="Reservatório 2 (caixa-d'água)" value={`${state.r2.toFixed(0)}%`} hint="Abastecido pela bomba" />
        <Stat icon={Power} label="Bomba d'água" value={state.pumpOn ? "Ligada" : "Desligada"} hint={`Aciona em ${settings.onLimit}% · desliga em ${settings.offLimit}%`} tone={state.pumpOn ? "success" : "warning"} />
        <Stat icon={Battery} label="Bateria" value={`${state.battery.toFixed(0)}%`} hint={`Painel solar: ${state.solarW.toFixed(0)} W`} tone="success" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <h2 className="font-display font-semibold text-foreground">Níveis em tempo real (simulado)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="t" hide /><YAxis domain={[0, 100]} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Area dataKey="r1" name="R1 %" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} isAnimationActive={false} />
                <Area dataKey="r2" name="R2 %" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="bg-gradient-brand text-primary-foreground">
          <ShieldCheck className="h-8 w-8" />
          <h2 className="mt-3 font-display text-xl font-semibold">{ok ? "Sistema operando normalmente" : "Atenção: bateria baixa"}</h2>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li className="flex gap-2"><CloudRain className="h-4 w-4" /> Chuva: {state.raining ? "sim" : "não"}</li>
            <li className="flex gap-2"><Sun className="h-4 w-4" /> Geração solar: {state.solarW.toFixed(0)} W</li>
            <li className="flex gap-2"><Droplets className="h-4 w-4" /> Captado: {state.collectedL.toFixed(0)} L</li>
            <li className="flex gap-2"><Power className="h-4 w-4" /> Transferido: {state.transferredL.toFixed(0)} L</li>
            <li className="pt-2 text-xs opacity-75">Modo {settings.autoMode ? "automático" : "manual"} · dados simulados</li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
