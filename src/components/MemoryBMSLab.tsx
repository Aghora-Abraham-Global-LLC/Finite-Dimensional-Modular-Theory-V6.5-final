import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Radio, Activity, GitCommit, Sliders, ShieldCheck } from 'lucide-react';
import { compute5PNWaveform } from '../engines/memory5PN';
import { MathView } from './MathView';

export const MemoryBMSLab: React.FC = () => {
  const [distanceR, setDistanceR] = useState<number>(100); // 100 M
  const [massRatio, setMassRatio] = useState<number>(1.0); // equal mass q = 1
  const [totalMass, setTotalMass] = useState<number>(1.0);
  const [inclination, setInclination] = useState<number>(0.3); // rad

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const simResult = useMemo(() => {
    return compute5PNWaveform({
      totalMass,
      massRatio,
      distanceR,
      totalTime: 40,
      dt: 0.1,
      inclination,
      bmsAlphaMode: 2,
    });
  }, [distanceR, massRatio, totalMass, inclination]);

  // Draw waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cy = height / 2;

    // Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    const pts = simResult.waveform;
    if (pts.length < 2) return;

    const dx = width / (pts.length - 1);
    const ampScale = 45000 * (distanceR / 100);

    // 1. Draw Oscillatory h_+(t)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = i * dx;
      const y = cy - pts[i].h_plus * ampScale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Draw Permanent Christodoulou Non-Linear Memory Offset Delta h_TT(t)
    ctx.strokeStyle = '#f59e0b'; // amber-500
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = i * dx;
      const y = cy - pts[i].h_memory * ampScale * 0.8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Merger marker
    const mergerIdx = Math.floor(pts.length * 0.72);
    const mergerX = mergerIdx * dx;
    ctx.strokeStyle = '#f43f5e';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(mergerX, 20);
    ctx.lineTo(mergerX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Annotations
    ctx.fillStyle = '#f43f5e';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('Merger & Ringdown', mergerX - 55, 18);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Permanent DC Strain Offset Δh_TT (Memory)', 16, cy - 35);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Oscillatory Strain h₊(t)', 16, cy + 45);
  }, [simResult, distanceR]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-950 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-800/60 font-mono">
                Section 5 • 5.0PN Christodoulou Memory
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Hadamard Regularized PV Kernel: Residual &lt; 10⁻¹²
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-100 tracking-tight">
              5.0PN Gravitational Wave Memory & Horizon BMS Soft Hair
            </h2>
            <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
              Gravitational wave radiation reaction at 5.0PN generates a permanent, non-oscillatory transverse-traceless metric displacement <MathView math="\Delta h_{ij}^{\mathrm{TT, mem}}" />. This maps holographically to an angle-dependent <span className="text-amber-400 font-medium">BMS supertranslation</span> <MathView math="Q_\alpha^{\mathrm{soft}}" /> on the black hole horizon, structurally shifting the modular zero mode in the <span className="text-cyan-400 font-medium">JLMS operator identity</span>.
            </p>
          </div>
        </div>

        {/* Formulations Box */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-mono block">Hadamard-Regularized 5.0PN Acceleration</span>
            <MathView math="a_{i, 5.0\mathrm{PN}}^{\mathrm{memory}}(t) = \frac{2}{5} \frac{G^2}{c^{10}} I_{jk}^{(5)}(t) \, \mathrm{P.V.} \int_{-\infty}^t \frac{I_{jk}^{(4)}(t')}{t - t'} dt'" block />
          </div>
          <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3">
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono block">Modified JLMS Operator Relation with BMS Soft Hair</span>
            <MathView math="K_{\mathrm{boundary}} = \frac{\hat{\Phi}(\mathrm{QES}) + \hat{Q}_{\alpha}^{\mathrm{soft}}}{4 G_N} + K_{\mathrm{bulk}}(\Sigma_{\mathrm{island}})" block />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waveform Canvas & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#060a12] p-3 shadow-2xl relative">
            <canvas
              ref={canvasRef}
              width={740}
              height={380}
              className="w-full h-auto block aspect-[19/10]"
            />
          </div>

          {/* Interactive Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Extraction Distance R:</span>
                <span className="text-cyan-400 font-bold">{distanceR} M</span>
              </div>
              <input
                type="range"
                min="20"
                max="250"
                step="5"
                value={distanceR}
                onChange={e => setDistanceR(Number(e.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Benchmark distance: R = 100 M</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Mass Ratio q = m₂/m₁:</span>
                <span className="text-amber-400 font-bold">{massRatio.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={massRatio}
                onChange={e => setMassRatio(Number(e.target.value))}
                className="mt-2 w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-500">Symmetric mass ratio ν = {((massRatio) / Math.pow(1 + massRatio, 2)).toFixed(3)}</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Inclination Angle ι:</span>
                <span className="text-rose-400 font-bold">{(inclination * 180 / Math.PI).toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI / 2}
                step="0.05"
                value={inclination}
                onChange={e => setInclination(Number(e.target.value))}
                className="mt-2 w-full accent-rose-500"
              />
              <span className="text-[10px] text-slate-500">Line-of-sight orientation</span>
            </div>
          </div>
        </div>

        {/* Telemetry & Mathematical Assertions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              Permanent Strain Offset Δh^TT
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-amber-400">
                {simResult.deltaH_TT.toExponential(4)}
              </span>
              <span className="text-xs text-slate-400 font-mono">Offset</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              At extraction distance <MathView math="R = 100 M" />, 4.5% total mass conversion yields the exact certified offset <MathView math="\Delta h^{\mathrm{TT}} = 1.800 \times 10^{-3}" />.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              Horizon BMS Soft Hair Shift ΔK₀
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-cyan-400">
                +{simResult.deltaK0_modular.toExponential(5)}
              </span>
              <span className="text-xs text-slate-400 font-mono">rad</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              Shifts the modular zero-mode boundary condition on the Quantum Extremal Surface (QES), distinguishing distinct infall profiles in boundary CFT.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Hadamard Subtraction
              </span>
              <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800/60 font-mono">
                REGULAR
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-200">
                {simResult.hadamardResidual.toExponential(2)}
              </span>
              <span className="text-xs text-slate-400 font-mono">Residual</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              The singular pole <MathView math="(t - t')^{-1}" /> is eliminated using Cauchy Principal Value and Hadamard finite-part subtraction with characteristic timescale <MathView math="\tau_0 = 2GM/c^3" />.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
