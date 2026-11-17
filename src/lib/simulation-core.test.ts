import { describe, expect, it } from "vitest";
import { decidePump, defaultSettings } from "./simulation-core";
const cfg = defaultSettings;
describe("regras da bomba", () => {
  it("liga quando R1 atinge o limite de acionamento", () => {
    expect(decidePump({ r1: 80, r2: 50, pumpOn: false, battery: 50 }, cfg)).toBe(true);
  });
  it("não liga abaixo do limite", () => {
    expect(decidePump({ r1: 79, r2: 50, pumpOn: false, battery: 50 }, cfg)).toBe(false);
  });
  it("desliga ao chegar no limite de desligamento", () => {
    expect(decidePump({ r1: 20, r2: 50, pumpOn: true, battery: 50 }, cfg)).toBe(false);
  });
  it("desliga com o reservatório 2 cheio", () => {
    expect(decidePump({ r1: 90, r2: 100, pumpOn: true, battery: 50 }, cfg)).toBe(false);
  });
});
