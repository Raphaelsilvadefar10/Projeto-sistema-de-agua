import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";

export const Route = createFileRoute("/configuracoes")({
  head: pageHead("Configurações", "Defina os limites de acionamento e desligamento da bomba."),
  component: Page,
});

function Page() {
  const { settings, setSettings } = useSim();
  const [d, setD] = useState(settings);
  const invalid = d.offLimit >= d.onLimit;
  return (
    <>
      <PageHeader title="Configurações" subtitle="Ajuste os limites usados pelo controle automático da bomba." />
      <Panel className="max-w-xl space-y-8">
        <div>
          <div className="flex justify-between text-sm"><span className="font-medium">Limite de acionamento</span><span>{d.onLimit}%</span></div>
          <p className="text-xs text-muted-foreground">A bomba liga quando o reservatório 1 atinge este nível.</p>
          <Slider className="mt-3" min={10} max={100} step={5} value={[d.onLimit]} onValueChange={([v]) => setD({ ...d, onLimit: v ?? d.onLimit })} />
        </div>
        <div>
          <div className="flex justify-between text-sm"><span className="font-medium">Limite de desligamento</span><span>{d.offLimit}%</span></div>
          <p className="text-xs text-muted-foreground">A bomba desliga quando o reservatório 1 baixa até este nível.</p>
          <Slider className="mt-3" min={0} max={90} step={5} value={[d.offLimit]} onValueChange={([v]) => setD({ ...d, offLimit: v ?? d.offLimit })} />
        </div>
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">Modo automático</div><p className="text-xs text-muted-foreground">Arduino controla a bomba pelos limites.</p></div>
          <Switch checked={d.autoMode} onCheckedChange={(v) => setD({ ...d, autoMode: v })} />
        </div>
        {invalid && <p className="text-sm text-destructive">O desligamento deve ser menor que o acionamento.</p>}
        <Button disabled={invalid} onClick={() => { setSettings(d); toast.success("Configurações salvas"); }}>Salvar</Button>
      </Panel>
    </>
  );
}
