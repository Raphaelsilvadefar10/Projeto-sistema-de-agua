import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { defaultSettings, initialState, step, type LogEvent, type Settings, type SimState } from "./simulation-core";

interface Point { t: number; r1: number; r2: number; battery: number; solar: number }
interface Ctx {
  state: SimState; settings: Settings; log: LogEvent[]; series: Point[];
  setSettings: (s: Settings) => void; setPump: (on: boolean) => void;
}
const SimContext = createContext<Ctx | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [settings, setSettingsState] = useState(defaultSettings);
  const [log, setLog] = useState<LogEvent[]>([]);
  const [series, setSeries] = useState<Point[]>([]);
  const idRef = useRef(0);
  const stateRef = useRef(state); stateRef.current = state;
  const cfgRef = useRef(settings); cfgRef.current = settings;

  const push = useCallback((evs: Omit<LogEvent, "id" | "time">[]) => {
    if (!evs.length) return;
    const now = Date.now();
    setLog((l) => [...evs.map((e) => ({ ...e, id: ++idRef.current, time: now })).reverse(), ...l].slice(0, 200));
  }, []);

  useEffect(() => {
    push([{ type: "leitura", message: "Simulação iniciada — dados simulados, sem conexão com Arduino" }]);
    const iv = setInterval(() => {
      const { state: next, events } = step(stateRef.current, cfgRef.current);
      setState(next); push(events);
      setSeries((s) => [...s, { t: next.tick, r1: +next.r1.toFixed(1), r2: +next.r2.toFixed(1), battery: +next.battery.toFixed(1), solar: +next.solarW.toFixed(0) }].slice(-60));
    }, 1500);
    return () => clearInterval(iv);
  }, [push]);

  const setSettings = (s: Settings) => {
    setSettingsState(s);
    push([{ type: "config", message: `Configuração: liga ${s.onLimit}%, desliga ${s.offLimit}%, modo ${s.autoMode ? "automático" : "manual"}` }]);
  };
  const setPump = (on: boolean) => {
    setState((s) => ({ ...s, pumpOn: on }));
    push([{ type: on ? "acionamento" : "desligamento", message: `Bomba ${on ? "ligada" : "desligada"} manualmente` }]);
  };
  return <SimContext.Provider value={{ state, settings, log, series, setSettings, setPump }}>{children}</SimContext.Provider>;
}

export function useSim() {
  const c = useContext(SimContext);
  if (!c) throw new Error("useSim fora do provider");
  return c;
}
