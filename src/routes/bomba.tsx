import { createFileRoute } from "@tanstack/react-router";
import { Fan } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";

export const Route = createFileRoute("/bomba")({
  head: pageHead("Controle da bomba", "Status, limites de acionamento e histórico simulado da bomba d'água."),
  component: Page,
});

function Page() {
  const { state, settings, log, setPump } = useSim();
  const events = log.filter((e) => e.type === "acionamento" || e.type === "desligamento").slice(0, 15);
  return (
    <>
      <PageHeader title="Controle da bomba" subtitle="O Arduino aciona a bomba automaticamente quando o reservatório 1 atinge o limite programado." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex flex-col items-center py-8 text-center">
          <div className={`grid h-28 w-28 place-items-center rounded-full ${state.pumpOn ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
            <Fan className={`h-14 w-14 ${state.pumpOn ? "spin-slow" : ""}`} />
          </div>
          <div className="mt-4 font-display text-2xl font-bold">{state.pumpOn ? "Ligada" : "Desligada"}</div>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Comando manual</span>
            <Switch checked={state.pumpOn} disabled={settings.autoMode} onCheckedChange={setPump} />
          </div>
          {settings.autoMode && <p className="mt-2 text-xs text-muted-foreground">Desative o modo automático em Configurações para usar o comando manual.</p>}
        </Panel>
        <Panel>
          <h2 className="font-display font-semibold">Limites programados</h2>
          {[["Acionamento", settings.onLimit, "bg-success"], ["Desligamento", settings.offLimit, "bg-warning"], ["Nível atual R1", state.r1, "bg-primary"]].map(([n, v, c]) => (
            <div key={n as string} className="mt-4">
              <div className="flex justify-between text-sm"><span>{n}</span><span className="font-medium">{(v as number).toFixed(0)}%</span></div>
              <div className="mt-1 h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${c} transition-all`} style={{ width: `${v}%` }} /></div>
            </div>
          ))}
          <p className="mt-4 text-xs text-muted-foreground">Proteções: desliga com caixa-d'água cheia ou bateria abaixo de 5%.</p>
        </Panel>
        <Panel>
          <h2 className="font-display font-semibold">Histórico da bomba</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {events.length === 0 && <li className="text-muted-foreground">Nenhum acionamento ainda.</li>}
            {events.map((e) => (
              <li key={e.id} className="flex gap-2"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.type === "acionamento" ? "bg-success" : "bg-warning"}`} />
                <span><span className="text-muted-foreground">{new Date(e.time).toLocaleTimeString("pt-BR")}</span> — {e.message}</span></li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
