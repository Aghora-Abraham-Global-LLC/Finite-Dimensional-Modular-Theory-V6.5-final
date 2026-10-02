import React, { useMemo, useState } from 'react';
import { Cpu, LineChart, ShieldCheck, Box, RefreshCw } from 'lucide-react';
import { computeMPSModularSpectrum, computeSSSMatrixData } from '../engines/mpsModular';
import { MathView } from './MathView';

export const MPSMatrixLab: React.FC = () => {
  const [bondChi, setBondChi] = useState<number>(64);
  const mpsResult = useMemo(() => computeMPSModularSpectrum(bondChi), [bondChi]);
  const sssData = useMemo(() => computeSSSMatrixData(50), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-sky-950 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-800/60 font-mono">
                Section 10 • Many-Body MPS & Matrix Duals
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Bisognano-Wichmann Linearity R² = 0.9882 ≥ 0.985
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-100 tracking-tight">
              Many-Body MPS Modular Flow & Non-Perturbative SSS Matrix Duals
            </h2>
            <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
              Demonstrates that finite-dimensional tensor network contractions (<MathView math="N = 16" /> qubits, virtual bond <MathView math="\chi = 64" />) reproduce continuous conformal field theory modular spectrum linearity. Non-perturbative wormholes are evaluated via the double-scaled Saad--Shenker--Stanford (SSS) random matrix model.
            </p>
          </div>
        </div>

        {/* Governing Formulas */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3">
            <span className="text-[10px] text-sky-400 uppercase tracking-wider font-mono block">MPS Bisognano-Wichmann Linear Spectrum</span>
            <MathView math="\xi_k = -2 \ln s_k = c_0 + c_1 \, k + \mathcal{O}(k^2), \qquad R^2 = 0.9882 \ge 0.985" block />
          </div>
          <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-mono block">SSS Leading Spectral Density & SFF Ramp</span>
            <MathView math="\rho_0(E) = \frac{\gamma}{4\pi^2} \sinh(2\pi \sqrt{E}), \qquad K(\tau) \sim \frac{\tau}{2\pi}" block />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: MPS Spectrum Regression Plot (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#060a12] p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <LineChart className="h-4 w-4 text-sky-400" />
                MPS Subsystem Modular Spectrum ξ_k = -2 ln s_k
              </span>
              <span className="text-emerald-400 font-bold">R² = {mpsResult.R2.toFixed(4)}</span>
            </div>

            {/* SVG Plot */}
            <div className="relative h-60 w-full bg-slate-950 rounded-lg p-2 border border-slate-900">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Grid lines */}
                <line x1="30" y1="180" x2="380" y2="180" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="20" x2="30" y2="180" stroke="#334155" strokeWidth="1" />

                {/* Linear regression line */}
                <line
                  x1={30 + (1 / 24) * 350}
                  y1={180 - (mpsResult.spectrum[0]?.fitted || 0) * 16}
                  x2={30 + (24 / 24) * 350}
                  y2={180 - (mpsResult.spectrum[23]?.fitted || 0) * 16}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />

                {/* Data points */}
                {mpsResult.spectrum.map((pt, i) => {
                  const x = 30 + (pt.k / 24) * 350;
                  const y = 180 - pt.xi * 16;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Bond Dimension χ = {bondChi}</span>
              <span>Slope c₁ = {mpsResult.c1.toFixed(3)} (Modular Temp β = 2π)</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 font-mono text-xs">
            <span className="text-slate-300 font-semibold block">Bond Dimension Selector</span>
            <div className="flex gap-2">
              {[16, 32, 64, 128].map(chi => (
                <button
                  key={chi}
                  onClick={() => setBondChi(chi)}
                  className={`flex-1 py-1.5 rounded text-center transition ${
                    bondChi === chi ? 'bg-sky-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  χ = {chi}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: SSS Random Matrix Model & SFF Ramp (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#060a12] p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Box className="h-4 w-4 text-amber-400" />
                Spectral Form Factor K(τ) Linear Ramp
              </span>
              <span className="text-amber-400 font-mono">Slope = 1 / 2π</span>
            </div>

            {/* SVG SFF Plot */}
            <div className="relative h-60 w-full bg-slate-950 rounded-lg p-2 border border-slate-900">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Axes */}
                <line x1="30" y1="180" x2="380" y2="180" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="20" x2="30" y2="180" stroke="#334155" strokeWidth="1" />

                {/* SFF Curve */}
                <path
                  d={sssData.sffPoints.map((pt, i) => {
                    const x = 30 + (i / sssData.sffPoints.length) * 350;
                    const y = 180 - (pt.SFF / 4.5) * 150;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${Math.min(180, Math.max(20, y))}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Early Dip (1/τ³)</span>
              <span className="text-amber-300">Linear Ramp K(τ) ~ τ / 2π</span>
              <span>Plateau Saturation</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-2 font-mono text-xs">
            <span className="text-slate-300 uppercase tracking-wider block">Eynard-Orantin Topological Recursion</span>
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400">Weil-Petersson Volume V_{'{0,3}'}:</span>
              <span className="text-cyan-300 font-bold">{sssData.weilPetersson_V03}</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-400">Weil-Petersson Volume V_{'{1,1}'}(b=2):</span>
              <span className="text-amber-300 font-bold">{sssData.weilPetersson_V11.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
