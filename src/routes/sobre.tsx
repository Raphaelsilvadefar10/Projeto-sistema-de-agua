import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, Cpu, CloudRain, Droplets, Gauge, Sun, Waves, Wrench } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/sobre")({
  head: pageHead("Sobre o projeto", "Objetivo, funcionamento, componentes e benefícios do sistema de aproveitamento de água da chuva."),
  component: Page,
});

const steps = [
  { i: CloudRain, t: "Captação", d: "A água da chuva é direcionada das calhas ao primeiro reservatório." },
  { i: Gauge, t: "Monitoramento", d: "O sensor de nível mede continuamente o reservatório 1." },
  { i: Cpu, t: "Processamento", d: "O Arduino compara a leitura com o limite programado." },
  { i: Droplets, t: "Transferência", d: "A bomba é acionada e envia a água para a caixa-d'água." },
];
const parts = [
  { i: Cpu, t: "Arduino", d: "" },
  { i: Gauge, t: "Sensor de presença", d: "" },
  { i: Droplets, t: "Bomba d'água", d: "" },
  { i: Sun, t: "Painel solar", d: "" },
  { i: BatteryCharging, t: "Baterias", d: "" },
  { i: Waves, t: "Reservatórios", d: "" },
  { i: Cpu, t: "Relé", d: "" },
];
function Page() {
  return (
    <>
   <PageHeader title="Sobre o projeto" subtitle="Nosso projeto consiste no desenvolvimento de um sistema automatizado de captação e aproveitamento da água da chuva. Ele utiliza Arduino, sensor de presença, bomba d’água e energia solar para controlar a transferência da água entre dois reservatórios." />
<Panel>
  <h2 className="font-display text-lg font-semibold">Objetivo</h2>
  <p className="mt-2 text-muted-foreground">O principal objetivo é reaproveitar a água da chuva, contribuindo para a sustentabilidade, principalmente diante dos problemas de falta de água que motivaram o desenvolvimento do projeto.</p>
</Panel>
      <h2 className="mt-8 font-display text-lg font-semibold">Componentes</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((s) => (<Panel key={s.t} className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground"><s.i className="h-5 w-5" /></span><div><h3 className="font-semibold">{s.t}</h3><p className="text-sm text-muted-foreground">{s.d}</p></div></Panel>))}
      </div>
      <h2 className="mt-8 font-display text-lg font-semibold">Benefícios</h2>
      <Panel className="mt-3"><ul className="grid gap-2 text-sm sm:grid-cols-2">
        {["Economia de água potável", "Energia limpa e independente da rede", "Operação automática e confiável", "Fácil inspeção e manutenção dos componentes", "Instalação elétrica segura em baixa tensão", "Incentivo ao uso consciente dos recursos"].map((b) => (
          <li key={b} className="flex gap-2"><Wrench className="h-4 w-4 text-success" />{b}</li>))}
      </ul></Panel>
      <p className="mt-6 text-xs text-muted-foreground">Este site apresenta dados simulados. Não há conexão real com Arduino ou sensores; a estrutura está preparada para integração futura.</p>
    </>
  );
}
