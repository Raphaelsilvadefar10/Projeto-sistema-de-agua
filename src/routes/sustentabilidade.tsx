import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Leaf, Recycle, Sprout } from "lucide-react";
import { PageHeader, Panel } from "@/components/AppShell";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";

export const Route = createFileRoute("/sustentabilidade")({
  head: pageHead("Sustentabilidade", "A importância do reaproveitamento da água da chuva e a economia de água potável."),
  component: Page,
});

function Page() {
  const { state } = useSim();
  return (
    <>
      <PageHeader title="Sustentabilidade" subtitle="Cada litro de chuva reaproveitado é um litro a menos de água tratada utilizada em tarefas que não exigem potabilidade." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="bg-gradient-brand text-primary-foreground"><Droplets className="h-6 w-6" /><div className="mt-3 font-display text-3xl font-bold">{state.collectedL.toFixed(0)} L</div><div className="text-sm opacity-90">captados nesta sessão (simulado)</div></Panel>
        <Panel><Recycle className="h-6 w-6 text-success" /><div className="mt-3 font-display text-3xl font-bold">{state.transferredL.toFixed(0)} L</div><div className="text-sm text-muted-foreground">de água potável economizada</div></Panel>
        <Panel><Leaf className="h-6 w-6 text-success" /><div className="mt-3 font-display text-3xl font-bold">100%</div><div className="text-sm text-muted-foreground">energia solar no sistema</div></Panel>
      </div>
      <h2 className="mt-8 font-display text-lg font-semibold">Usos indicados para a água da chuva</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Descarga de vasos sanitários", "Irrigação de jardins e hortas", "Lavagem de pisos e calçadas", "Lavagem de veículos"].map((u) => (
          <Panel key={u} className="flex items-center gap-3"><Sprout className="h-5 w-5 text-success" /><span className="text-sm">{u}</span></Panel>))}
      </div>
      <Panel className="mt-6"><h3 className="font-semibold">Reaproveitamento adequado</h3>
        <p className="mt-2 text-sm text-muted-foreground">A água da chuva não deve ser consumida sem tratamento. Mantenha calhas e reservatórios limpos, descarte os primeiros milímetros de chuva e mantenha os reservatórios tampados para evitar a proliferação de mosquitos.</p></Panel>
    </>
  );
}
