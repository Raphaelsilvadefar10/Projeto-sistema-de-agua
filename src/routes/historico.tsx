import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/AppShell";
import { pageHead } from "@/lib/head";
import { useSim } from "@/lib/simulation";
import type { EventType } from "@/lib/simulation-core";

export const Route = createFileRoute("/historico")({
  head: pageHead("Histórico", "Registros simulados de leituras, acionamentos e transferências."),
  component: Page,
});

const filters: { v: EventType | "todos"; l: string }[] = [
  { v: "todos", l: "Todos" }, { v: "leitura", l: "Leituras" }, { v: "acionamento", l: "Acionamentos" },
  { v: "desligamento", l: "Desligamentos" }, { v: "transferencia", l: "Transferências" }, { v: "chuva", l: "Chuva" },
];

function Page() {
  const { log } = useSim();
  const [f, setF] = useState<EventType | "todos">("todos");
  const rows = f === "todos" ? log : log.filter((e) => e.type === f);
  return (
    <>
      <PageHeader title="Histórico" subtitle="Eventos registrados durante a simulação desta sessão." />
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((x) => (
          <button key={x.v} onClick={() => setF(x.v)} className={`rounded-full px-3 py-1.5 text-sm transition ${f === x.v ? "bg-primary text-primary-foreground" : "bg-card border text-foreground hover:bg-muted"}`}>{x.l}</button>
        ))}
      </div>
      <Panel className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left text-muted-foreground"><tr><th className="p-3">Horário</th><th className="p-3">Tipo</th><th className="p-3">Descrição</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Nenhum registro.</td></tr>}
            {rows.map((e) => (
              <tr key={e.id} className="border-b last:border-0">
                <td className="whitespace-nowrap p-3 text-muted-foreground">{new Date(e.time).toLocaleTimeString("pt-BR")}</td>
                <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground">{e.type}</span></td>
                <td className="p-3">{e.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
