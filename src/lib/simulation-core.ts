// Lógica pura da simulação. Preparada para ser substituída por leituras reais do Arduino no futuro.
export type EventType = "leitura" | "acionamento" | "desligamento" | "transferencia" | "chuva" | "config";
export interface LogEvent { id: number; time: number; type: EventType; message: string }
export interface Settings { onLimit: number; offLimit: number; autoMode: boolean }
export interface SimState {
  r1: number; r2: number; pumpOn: boolean; battery: number; solarW: number;
  raining: boolean; transferredL: number; collectedL: number; tick: number;
}
export const TANK_CAPACITY_L = 500;
export const initialState: SimState = {
  r1: 55, r2: 40, pumpOn: false, battery: 72, solarW: 0, raining: true,
  transferredL: 0, collectedL: 0, tick: 0,
};
export const defaultSettings: Settings = { onLimit: 80, offLimit: 20, autoMode: true };

const clamp = (v: number, a = 0, b = 100) => Math.min(b, Math.max(a, v));

/** RN02: liga ao atingir onLimit; desliga em offLimit, com reservatório 2 cheio ou bateria crítica. */
export function decidePump(s: Pick<SimState, "r1" | "r2" | "pumpOn" | "battery">, cfg: Settings): boolean {
  if (s.battery <= 5 || s.r2 >= 100 || s.r1 <= cfg.offLimit) return false;
  if (!s.pumpOn && s.r1 >= cfg.onLimit) return true;
  return s.pumpOn;
}

export function step(s: SimState, cfg: Settings, rand: () => number = Math.random) {
  const events: Omit<LogEvent, "id" | "time">[] = [];
  const tick = s.tick + 1;
  let raining = s.raining;
  if (rand() < 0.04) {
    raining = !raining;
    events.push({ type: "chuva", message: raining ? "Início de chuva detectado (simulado)" : "Chuva encerrada (simulado)" });
  }
  const rainIn = raining ? 0.8 + rand() * 1.2 : 0;
  let r1 = clamp(s.r1 + rainIn);
  const solarW = clamp(raining ? 15 + rand() * 25 : 60 + rand() * 40, 0, 100);
  let battery = clamp(s.battery + solarW * 0.012 - (s.pumpOn ? 0.9 : 0.05));
  let r2 = s.r2 - 0.25; // consumo da caixa-d'água
  let transferredL = s.transferredL;
  if (s.pumpOn) {
    const moved = Math.min(r1, 2.5, 100 - r2);
    r1 -= moved; r2 += moved;
    transferredL += (moved / 100) * TANK_CAPACITY_L;
  }
  r2 = clamp(r2);
  let pumpOn = s.pumpOn;
  if (cfg.autoMode) {
    const next = decidePump({ r1, r2, pumpOn, battery }, cfg);
    if (next !== pumpOn) {
      events.push(next
        ? { type: "acionamento", message: `Bomba acionada: R1 em ${r1.toFixed(0)}% (limite ${cfg.onLimit}%)` }
        : { type: "desligamento", message: `Bomba desligada: R1 ${r1.toFixed(0)}%, R2 ${r2.toFixed(0)}%` });
      if (!next && s.pumpOn) events.push({ type: "transferencia", message: `Transferência concluída — total ${transferredL.toFixed(0)} L` });
      pumpOn = next;
    }
  }
  if (tick % 10 === 0) events.push({ type: "leitura", message: `Leitura: R1 ${r1.toFixed(0)}%, R2 ${r2.toFixed(0)}%, bateria ${battery.toFixed(0)}%` });
  return {
    state: { r1, r2, pumpOn, battery, solarW, raining, transferredL, collectedL: s.collectedL + (rainIn / 100) * TANK_CAPACITY_L, tick },
    events,
  };
}
