import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BatteryCharging, Cog, Droplets, Gauge, History, Info, Leaf, Menu, Sun, Waves, X } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/reservatorios", label: "Reservatórios", icon: Waves },
  
  { to: "/energia", label: "Energia solar", icon: Sun },
 
  { to: "/sobre", label: "Sobre o projeto", icon: Info },
  { to: "/sustentabilidade", label: "Sustentabilidade", icon: Leaf },
  { to: "/configuracoes", label: "Configurações", icon: Cog },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background lg:flex">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
        <Brand />
        <button aria-label="Abrir menu" onClick={() => setOpen(!open)} className="rounded-md p-2 hover:bg-muted">
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <aside className={`${open ? "block" : "hidden"} fixed inset-x-0 top-[57px] z-20 bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0`}>
        <div className="hidden p-6 lg:block"><Brand dark /></div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: "!bg-sidebar-primary !text-sidebar-primary-foreground font-medium" }}>
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="m-3 rounded-lg border border-sidebar-border p-3 text-xs text-sidebar-foreground/70">
          <BatteryCharging className="mb-1 h-4 w-4 text-success" />
          Dados simulados. Estrutura pronta para integração futura com Arduino.
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}

function Brand({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-primary-foreground"><Droplets className="h-5 w-5" /></span>
      <div className={`font-display leading-tight ${dark ? "text-sidebar-foreground" : "text-foreground"}`}>
        <div className="text-sm font-bold">AquaChuva</div>
        <div className="text-[10px] uppercase tracking-wider opacity-70">Sistema automatizado</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Simulação ativa
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card p-5 shadow-card ${className}`}>{children}</div>;
}

export function Tank({ label, level, sub }: { label: string; level: number; sub: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-56 w-36 overflow-hidden rounded-b-3xl rounded-t-lg border-4 border-primary/30 bg-muted">
        <div className="absolute inset-x-0 bottom-0 bg-gradient-water transition-[height] duration-1000 ease-out" style={{ height: `${level}%` }}>
          <div className="wave absolute -top-3 left-0 h-6 w-[200%]" />
        </div>
        <div className="absolute inset-0 grid place-items-center font-display text-3xl font-bold text-foreground mix-blend-luminosity">{level.toFixed(0)}%</div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-display font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
