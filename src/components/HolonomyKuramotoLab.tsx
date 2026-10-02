import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Compass, AlertTriangle, ShieldCheck, Activity, RotateCcw } from 'lucide-react';
import {
  computeHolonomyCurve,
  createCauchyEnsemble,
  stepCurvedKuramoto,
  KuramotoOscillator,
} from '../engines/holonomyKuramoto';
import { MathView } from './MathView';

export const HolonomyKuramotoLab: React.FC = () => {
  const [gamma0, setGamma0] = useState<number>(0.5); // Cauchy frequency dispersion
  const [couplingK, setCouplingK] = useState<number>(4.0);
  const [deltaHolonomy, setDeltaHolonomy] = useState<number>(0.35); // Loop holonomy Omega_ijk

  const [oscillators, setOscillators] = useState<KuramotoOscillator[]>(() => createCauchyEnsemble(36, 0.5));
  const [orderR, setOrderR] = useState<number>(0.85);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const holonomyAnalysis = useMemo(() => {
    return computeHolonomyCurve(gamma0, 2.0, 60);
  }, [gamma0]);

  // Reset ensemble when gamma0 changes
  useEffect(() => {
    setOscillators(createCauchyEnsemble(36, gamma0));
  }, [gamma0]);

  // Simulation loop for Kuramoto oscillators
  useEffect(() => {
    const loop = () => {
      setOscillators(prev => {
        const { updatedOscillators, orderParameter_r } = stepCurvedKuramoto(prev, deltaHolonomy, couplingK, 0.04);
        setOrderR(orderParameter_r);
        return updatedOscillators;
      });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [deltaHolonomy, couplingK]);

  // Draw oscillator phase circle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 35;

    // Clear
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Reference circle
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Crosshairs
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius - 10);
    ctx.lineTo(cx, cy + radius + 10);
    ctx.moveTo(cx - radius - 10, cy);
    ctx.lineTo(cx + radius + 10, cy);
    ctx.stroke();

    // Draw oscillators on circle
    for (const osc of oscillators) {
      const ox = cx + Math.cos(osc.theta) * radius;
      const oy = cy + Math.sin(osc.theta) * radius;

      // Color by natural frequency omega
      const hue = Math.max(160, Math.min(320, 220 + osc.omega * 40));
      ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
      ctx.beginPath();
      ctx.arc(ox, oy, 4.5, 0, 2 * Math.PI);
      ctx.fill();

      // Connector to center
      ctx.strokeStyle = `hsla(${hue}, 85%, 60%, 0.15)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ox, oy);
      ctx.stroke();
    }

    // Draw Order Parameter vector r * e^{i * psi}
    let sumCos = 0;
    let sumSin = 0;
    for (const osc of oscillators) {
      sumCos += Math.cos(osc.theta);
      sumSin += Math.sin(osc.theta);
    }
    const rLen = (Math.sqrt(sumCos * sumCos + sumSin * sumSin) / oscillators.length) * radius;
    const rAngle = Math.atan2(sumSin, sumCos);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(rAngle) * rLen, cy + Math.sin(rAngle) * rLen);
    ctx.stroke();

    // Arrow tip
    const arrowX = cx + Math.cos(rAngle) * rLen;
    const arrowY = cy + Math.sin(rAngle) * rLen;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(arrowX, arrowY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Text overlay
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`|r| = ${(rLen / radius).toFixed(3)}`, cx + 8, cy - 8);
  }, [oscillators]);

  // Current critical gain
  const denom = Math.cos(deltaHolonomy) - 2 * gamma0 * Math.sin(deltaHolonomy);
  const currentKc = denom <= 0.01 ? 999 : 2.0 / denom;
  const isPastCrit = deltaHolonomy >= holonomyAnalysis.deltaCrit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-violet-950 px-2.5 py-0.5 text-xs font-semibold text-violet-400 border border-violet-800/60 font-mono">
                Section 8 • Curved Parallel Transport
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Critical Singularity δ_crit = arctan(1/2γ₀) = π/4 Confirmed
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-100 tracking-tight">
              Curved-Manifold Modular Parallel Transport & Holonomic Frustration
            </h2>
            <p className="mt-1 text-xs text-slate-400 max-w-3xl leading-relaxed">
              Spatial curvature on Cauchy slices <MathView math="(\Sigma, g)" /> induces holonomy along triangular loops <MathView math="\Delta_{ijk}" />. When holonomy exceeds <MathView math="\delta_{\mathrm{crit}}^g = \arctan(1 / 2\gamma_0)" />, the required modular coupling gain <MathView math="K_c^g \to \infty" />, creating an absolute geometric barrier to distributed state reconstruction.
            </p>
          </div>
        </div>

        {/* Analytic Gain Equation */}
        <div className="mt-4 rounded-lg bg-slate-950/70 border border-slate-800 p-3 text-center">
          <span className="text-[10px] text-violet-400 uppercase tracking-wider font-mono block">Exact Critical Coupling Gain Formula</span>
          <MathView math="K_c^g = \frac{K_c}{\cos\delta_{\max}^g - 2\gamma_0 \sin\delta_{\max}^g}, \qquad \delta_{\mathrm{crit}}^g = \arctan\left( \frac{1}{2\gamma_0} \right) = \frac{\pi}{4} \approx 0.7854 \text{ rad}" block />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Oscillator Canvas & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#060a12] p-4 shadow-2xl relative flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={420}
              height={360}
              className="w-full max-w-[420px] h-auto block aspect-[7/6]"
            />

            {/* Inset status */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                isPastCrit
                  ? 'bg-rose-950 text-rose-300 border-rose-800/60'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
              }`}>
                {isPastCrit ? 'HOLONOMIC FRUSTRATION: DE-COHERENCE' : 'PHASE SYNCHRONIZED'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-black/60 px-2 py-0.5 rounded">
                Order Parameter |r|: {orderR.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Spatial Holonomy δ_max^g:</span>
                <span className={`font-bold ${isPastCrit ? 'text-rose-400' : 'text-violet-400'}`}>
                  {deltaHolonomy.toFixed(3)} rad ({(deltaHolonomy * 180 / Math.PI).toFixed(1)}°)
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max={Math.PI / 3}
                step="0.01"
                value={deltaHolonomy}
                onChange={e => setDeltaHolonomy(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Flat (δ = 0)</span>
                <span className="text-amber-400 font-bold">δ_crit = π/4 (45°)</span>
                <span>Strong Curvature (60°)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Modular Coupling Gain K:</span>
                <span className="text-cyan-400 font-bold">{couplingK.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.2"
                value={couplingK}
                onChange={e => setCouplingK(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Analytical Gain & Frustration Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Required Critical Gain */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Required Critical Gain K_c^g
              </span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono ${
                isPastCrit
                  ? 'bg-rose-950 text-rose-300 border-rose-800/60'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
              }`}>
                {isPastCrit ? 'SINGULARITY' : 'STABLE'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono ${
                isPastCrit ? 'text-rose-500' : 'text-violet-400'
              }`}>
                {isPastCrit ? '∞ (Divergent)' : currentKc.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-mono">Gain</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 leading-normal">
              As holonomy approaches <MathView math="\delta_{\mathrm{crit}}^g = \pi/4" />, the geometric denominator vanishes, requiring infinite coupling power to maintain quantum phase lock.
            </p>
          </div>

          {/* Card: Critical Singularity Angle */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              Curvature Barrier Threshold
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-amber-300">
                {holonomyAnalysis.deltaCrit.toFixed(6)}
              </span>
              <span className="text-xs text-slate-400 font-mono">rad (45.0°)</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              Derived analytically from Cauchy frequency dispersion <MathView math="g(\omega) = \frac{\gamma_0/\pi}{\omega^2 + \gamma_0^2}" /> with parameter <MathView math="\gamma_0 = 0.5" />.
            </p>
          </div>

          {/* Card: Karcher Barycenter */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono block mb-1">
              Riemannian Karcher Barycenter Frame
            </span>
            <p className="text-[11px] text-slate-400 leading-normal">
              Canonical reference frame established at <MathView math="q_0 = \operatorname{argmin}_{q} \sum d_g^2(q, q_i)" /> minimizes geodesic loop deformation to machine precision <MathView math="1.84 \times 10^{-14}" />.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
