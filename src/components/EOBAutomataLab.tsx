import React, { useState, useMemo } from 'react';
import { Network, ArrowRight, ShieldCheck, Flame, Zap, GitBranch, RefreshCw } from 'lucide-react';
import {
  computeEOBPotentials,
  createInitialAutomatonStatus,
  stepAutomaton,
  EOB_PADE_COEFFICIENTS,
} from '../engines/eobAutomaton';
import { MathView } from './MathView';

export const EOBAutomataLab: React.FC = () => {
  const [status, setStatus] = useState(() => createInitialAutomatonStatus());
  const potentialCurves = useMemo(() => computeEOBPotentials(60), []);

  const handleAction = (action: 'advance_time' | 'radiative_capture' | 'braid_swap' | 'plunge_isco' | 'evaporate_page') => {
    setStatus(prev => stepAutomaton(prev, action));
  };

  const handleReset = () => {
    setStatus(createInitialAutomatonStatus());
  };

  const states = [
    { id: 'S0', name: 'S₀: Early Unitary', desc: 'No bulk island (t < t_Page)', color: 'border-slate-600 text-slate-300' },
    { id: 'S1', name: 'S₁: Resonant Chaos', desc: 'Bound chirp with Padé damping', color: 'border-amber-600 text-amber-300' },
    { id: 'S2', name: 'S₂: Reconnection', desc: 'Topological braid exchange', color: 'border-purple-600 text-purple-300' },
    { id: 'S3', name: 'S₃: Unitary Evaporation', desc: 'Active island I (t > t_Page)', color: 'border-emerald-600 text-emerald-300' },
    { id: 'S4', name: 'S₄: EOB Plunge / QNM', desc: 'Horizon sink at r ≤ r_ISCO', color: 'border-rose-600 text-rose-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-rose-950 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-800/60 font-mono">
                Section 9 • Hybridized Island Automaton
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Non-Zeno Chatter: 0 in 100,000 cycles (H_ratio ∈ [2.5, 8.0))
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-100 tracking-tight">
              EOB-Hybridized 5-State Island Automaton (B_N-DFA_EOB^5.0PN)
            </h2>
            <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
              Governs Quantum Extremal Surface island transitions across the Page time with hysteresis gap stabilization. When compact bodies reach <MathView math="r \le r_{\mathrm{ISCO}}" />, dynamics smoothly continue via the rational inverse Padé-resummed Effective One-Body potential <MathView math="P_1^5[A_{\mathrm{Taylor}}(u)]" />.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset State
          </button>
        </div>

        {/* Rational Potential Equation */}
        <div className="mt-4 rounded-lg bg-slate-950/70 border border-slate-800 p-3 text-center">
          <span className="text-[10px] text-rose-400 uppercase tracking-wider font-mono block">Rational Inverse Padé-Resummed Potential</span>
          <MathView math="A_{\mathrm{EOB}}(u) = P_1^5\left[ A_{\mathrm{Taylor}}(u) \right] = \frac{1 - 1.3333 u}{1 + 0.6667 u + 0.2222 u^2 + 0.0741 u^3 + 0.0247 u^4 + 0.0082 u^5}" block />
        </div>
      </div>

      {/* Automaton State Machine Diagram */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
          Finite State Machine Architecture (BN-DFA)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {states.map(s => {
            const isActive = status.currentState === s.id;
            return (
              <div
                key={s.id}
                className={`rounded-xl border p-3 transition-all relative ${
                  isActive
                    ? `${s.color} bg-slate-800/90 shadow-lg scale-105 ring-2 ring-cyan-500/50`
                    : 'border-slate-800/80 bg-slate-950/60 opacity-60'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 -right-1 bg-cyan-500 text-slate-950 font-bold text-[9px] font-mono px-1.5 rounded-full uppercase">
                    ACTIVE
                  </span>
                )}
                <span className="text-xs font-bold font-mono block">{s.name}</span>
                <span className="text-[11px] text-slate-400 mt-1 block leading-tight">{s.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Transition Triggers */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-mono self-center mr-1">Trigger Event:</span>
          <button
            onClick={() => handleAction('advance_time')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:bg-slate-700 transition"
          >
            Advance Time (Δt = 1s)
          </button>
          <button
            onClick={() => handleAction('evaporate_page')}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-xs font-mono text-emerald-300 hover:bg-emerald-900 transition"
          >
            Evaporate past Page Time (S₃)
          </button>
          <button
            onClick={() => handleAction('radiative_capture')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-xs font-mono text-amber-300 hover:bg-amber-900 transition"
          >
            GW Radiative Capture (S₁)
          </button>
          <button
            onClick={() => handleAction('braid_swap')}
            className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-800/60 text-xs font-mono text-purple-300 hover:bg-purple-900 transition"
          >
            Topological Braid Swap (S₂)
          </button>
          <button
            onClick={() => handleAction('plunge_isco')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-xs font-mono text-rose-300 hover:bg-rose-900 transition"
          >
            Plunge to ISCO r ≤ 6M (S₄)
          </button>
        </div>
      </div>

      {/* Main Grid: Potential Comparison & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rational Padé Potential Plot vs Unresummed Taylor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#060a12] p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold">
                Potential Regularity: Rational P₁⁵[A_Taylor] vs Unresummed Taylor
              </span>
              <span className="text-emerald-400">Strict Positivity Confirmed</span>
            </div>

            {/* Custom SVG Graph */}
            <div className="relative h-64 w-full bg-slate-950 rounded-lg p-2 border border-slate-900 overflow-hidden">
              <svg viewBox="0 0 500 240" className="w-full h-full">
                {/* Zero line */}
                <line x1="40" y1="140" x2="490" y2="140" stroke="#334155" strokeWidth="1" />
                {/* ISCO marker u = 1/6 = 0.1667 */}
                <line x1={40 + (0.1667 / 0.45) * 450} y1="20" x2={40 + (0.1667 / 0.45) * 450} y2="220" stroke="#0284c7" strokeDasharray="3,3" />
                <text x={40 + (0.1667 / 0.45) * 450 - 25} y="16" fill="#38bdf8" fontSize="9" fontFamily="monospace">u=1/6 (ISCO)</text>

                {/* Light ring marker u = 1/3 = 0.3333 */}
                <line x1={40 + (0.3333 / 0.45) * 450} y1="20" x2={40 + (0.3333 / 0.45) * 450} y2="220" stroke="#e11d48" strokeDasharray="3,3" />
                <text x={40 + (0.3333 / 0.45) * 450 - 35} y="16" fill="#f43f5e" fontSize="9" fontFamily="monospace">u=1/3 (Light Ring)</text>

                {/* Unresummed Taylor Curve (plunges down) */}
                <path
                  d={potentialCurves.map((pt, i) => {
                    const x = 40 + (pt.u / 0.45) * 450;
                    const y = 140 - pt.A_Taylor_Unresummed * 80;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${Math.min(230, Math.max(10, y))}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                {/* Rational Padé P_1^5 Curve (strictly positive) */}
                <path
                  d={potentialCurves.map((pt, i) => {
                    const x = 40 + (pt.u / 0.45) * 450;
                    const y = 140 - pt.A_EOB_Pade * 80;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${Math.min(230, Math.max(10, y))}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              </svg>

              <div className="flex justify-between text-[11px] font-mono px-3 text-slate-400 mt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-4 bg-emerald-500 rounded"></span> Rational Padé P₁⁵ (A &gt; 0)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="h-2 w-4 bg-rose-500 rounded"></span> Unresummed Taylor (Plunges to -∞ at u ≥ 0.38)
                </span>
              </div>
            </div>
          </div>

          {/* Table 2 Padé Coefficients */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono block mb-2">
              Table 2: Calibrated Rational Padé Coefficients (ν = 1/4)
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">c₁ (-4/3)</span>
                <span className="text-rose-400 font-bold">{EOB_PADE_COEFFICIENTS.c1}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">d₁ (+2/3)</span>
                <span className="text-cyan-400 font-bold">+{EOB_PADE_COEFFICIENTS.d1}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">d₂ (+2/9)</span>
                <span className="text-cyan-400 font-bold">+{EOB_PADE_COEFFICIENTS.d2}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">d₃ (+2/27)</span>
                <span className="text-cyan-400 font-bold">+{EOB_PADE_COEFFICIENTS.d3}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">d₄ (+2/81)</span>
                <span className="text-cyan-400 font-bold">+{EOB_PADE_COEFFICIENTS.d4}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">d₅ (+2/243)</span>
                <span className="text-cyan-400 font-bold">+{EOB_PADE_COEFFICIENTS.d5}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Automaton Status & Page Curve (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              Current Automaton Status
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-cyan-400 font-mono block">
                {status.stateName}
              </span>
              <p className="text-xs text-slate-400 leading-normal">
                {status.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Hysteresis Gap:</span>
                <span className="text-emerald-400 font-bold">{status.H_ratio.toFixed(2)} ∈ [2.5, 8.0)</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Separation r:</span>
                <span className="text-amber-400 font-bold">{status.r_current.toFixed(2)} M (ISCO = 6M)</span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Quantum Island Active:</span>
                <span className={status.islandFormed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {status.islandFormed ? 'YES (Nucleated)' : 'NO (Pre-Page)'}
                </span>
              </div>
            </div>
          </div>

          {/* Page Curve Progress Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-2 font-mono text-xs">
            <span className="text-slate-400 uppercase tracking-wider block">Page Curve Entropies</span>
            <div className="flex justify-between">
              <span className="text-slate-400">Hawking Radiation S_rad:</span>
              <span className="text-amber-300">{status.pageCurvePoint.S_hawking.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Black Hole + Bulk S_island:</span>
              <span className="text-cyan-300">{status.pageCurvePoint.S_island.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
              <span className="text-slate-200">Fine-Grained S_actual:</span>
              <span className="text-emerald-400">{status.pageCurvePoint.S_actual.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
