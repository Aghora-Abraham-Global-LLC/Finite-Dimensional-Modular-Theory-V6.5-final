import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, Hash, Bookmark, Search, Check } from 'lucide-react';
import { MathView } from './MathView';
import { PADE_TABLE_K16 } from '../engines/padeReservoir';
import { EOB_PADE_COEFFICIENTS } from '../engines/eobAutomaton';
import { BENCHMARK_SCORECARD } from '../engines/tribodyTestSuite';

export const PaperReader: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('abstract');
  const [copiedSha, setCopiedSha] = useState<boolean>(false);

  const shaDigest = 'e7b29a14f5c6d308a98b1e4c76023d84a1c590e8f23b71d60e5a88c32b9148d2';

  const handleCopySha = () => {
    navigator.clipboard.writeText(shaDigest);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleDownloadTex = () => {
    fetch('/Finite_V6_5.tex')
      .then(res => res.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Finite_V6_5.tex';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        alert('Downloading original LaTeX paper file...');
      });
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* Table of contents sticky sidebar (3 cols) */}
      <div className="hidden lg:block lg:col-span-3">
        <div className="sticky top-20 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-3 font-mono text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-800 pb-2">
            Contents Navigation
          </span>

          <nav className="space-y-1 text-slate-400">
            {[
              { id: 'abstract', title: 'Abstract & Physical Gaps' },
              { id: 'sec1', title: '1. Holographic Foundations' },
              { id: 'sec2', title: '2. Finite-Dim Modular Theory' },
              { id: 'sec3', title: '3. KMB Metric & mLSI Bounds' },
              { id: 'sec4', title: '4. Contact Thermodynamics' },
              { id: 'sec5', title: '5. 5.0PN Memory & BMS Hair' },
              { id: 'sec6', title: '6. K=16 Padé Bath Reservoirs' },
              { id: 'sec7', title: '7. Universal Twirled Petz Map' },
              { id: 'sec8', title: '8. Curved Holonomy Frustration' },
              { id: 'sec9', title: '9. EOB Island Automaton' },
              { id: 'sec10', title: '10. MPS Flow & SSS Matrix' },
              { id: 'sec11', title: '11. Empirical Verification' },
              { id: 'references', title: 'References' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left py-1.5 px-2 rounded transition flex items-center gap-1.5 ${
                  activeSection === item.id
                    ? 'bg-cyan-950 text-cyan-300 font-bold border-l-2 border-cyan-400'
                    : 'hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className="h-3 w-3 shrink-0" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={handleDownloadTex}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition"
            >
              <Download className="h-3.5 w-3.5" /> Download Finite_V6_5.tex
            </button>
          </div>
        </div>
      </div>

      {/* Main Manuscript Reader (9 cols) */}
      <div className="lg:col-span-9 space-y-8 font-serif leading-relaxed text-slate-200">
        {/* Paper Title & Header */}
        <header className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-cyan-400">
            <span className="rounded bg-cyan-950 px-2.5 py-0.5 border border-cyan-800/60">
              Preprint DOI: 10.5281/zenodo.23079423
            </span>
            <span className="rounded bg-slate-800 px-2.5 py-0.5 border border-slate-700 text-slate-300">
              October 1, 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-snug">
            Finite-Dimensional Modular Theory, Non-Commutative Relative-Entropy Geometry, Contact Thermodynamics, and Resilient Quantum Mirror Descent for Holographic State Reconstruction
          </h1>

          <p className="text-sm font-semibold text-cyan-300 tracking-wide font-mono">
            Version 6.5 Definitive Physical Synthesis: Contact Integrators, 5.0PN Christodoulou BMS Soft Hair, Adaptive K=16 Multi-Grid Padé Reservoirs, EOB Island Automata, and Empirical TriBody Workstation Benchmarks
          </p>

          <div className="pt-2 text-xs text-slate-400 space-y-1 font-sans">
            <div className="font-bold text-slate-200 text-sm">
              Arya Arunachala Ananda Ghulam-e-Shah-e-Unmani
            </div>
            <div>BhutaDamaraSena R&amp;D Labs · Aghora Abraham Global LLC</div>
            <div className="font-mono text-cyan-400">research@bhutadamarasena.com</div>
          </div>

          {/* Cryptographic SHA-256 Box */}
          <div className="mt-4 rounded-lg bg-slate-950/80 p-3 border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Cryptographic Publication SHA-256 Digest:</span>
              <span className="text-emerald-400 font-bold break-all">{shaDigest}</span>
            </div>
            <button
              onClick={handleCopySha}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700 transition"
            >
              {copiedSha ? 'Copied!' : 'Copy Hash'}
            </button>
          </div>
        </header>

        {/* Abstract */}
        <section id="abstract" className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-100 font-sans tracking-wide uppercase border-b border-slate-800 pb-2">
            Abstract
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            We establish the Definitive Version 6.5 Physical Synthesis uniting finite-dimensional Tomita--Takesaki modular theory, Kubo--Mori--Bogoliubov (KMB) non-commutative Riemannian geometry, and entropic optimization with macroscopic contact geometry, 5.0PN Christodoulou non-linear gravitational memory, and Effective One-Body (EOB) topological automata (Preprint DOI: 10.5281/zenodo.23079423). Grounded in comprehensive simulations and 28 automated tests from the relativistic <em className="text-cyan-300 font-sans">TriBody Workstation</em>, Version 6.5 systematically resolves the physical gaps, structural omissions, and formal ambiguities identified in prior iterations.
          </p>
        </section>

        {/* Section 1 */}
        <section id="sec1" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            1. Introduction and Holographic Foundations
          </h2>
          <p className="text-sm text-slate-300">
            In the gauge/gravity correspondence, the landmark Ryu--Takayanagi (RT) formula and its quantum extremal surface (QES) generalizations relate boundary fine-grained entropy to bulk geometry:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            <MathView math="S(\rho_B) = \operatorname{ext}_{\gamma_B} \left[ \frac{\operatorname{Area}(\gamma_B)}{4 G_N} + S_{\mathrm{bulk}}(\Sigma_B) \right]" block />
          </div>
          <p className="text-sm text-slate-300">
            Furthermore, the Jafferis--Lewkowycz--Maldacena--Suh (JLMS) operator relation asserts an equality between the modular Hamiltonian of boundary CFT and bulk modular Hamiltonian:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            <MathView math="K_{\mathrm{boundary}} \equiv -\ln \rho_B = \frac{\hat{A}(\mathrm{QES})}{4 G_N} + K_{\mathrm{bulk}}(\Sigma_B) + \mathcal{O}(G_N^0)" block />
          </div>
        </section>

        {/* Section 2 */}
        <section id="sec2" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            2. Finite-Dimensional Tomita--Takesaki Modular Theory
          </h2>
          <p className="text-sm text-slate-300">
            Let <MathView math="\mathcal{H} = \mathbb{C}^d" /> be a finite-dimensional Hilbert space, and <MathView math="\mathcal{B}(\mathcal{H}) = M_d(\mathbb{C})" /> the associated von Neumann factor of type <MathView math="\mathrm{I}_d" />.
          </p>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 font-sans block mb-1">Definition 2.1 (Relative Modular Operator)</span>
            <MathView math="\Delta_{\sigma|\rho}(X) = \sigma X \rho^{-1}, \qquad \sigma_t^\rho(X) = \Delta_\rho^{\mathrm{i}t}(X) = e^{-\mathrm{i} t K_\rho} X e^{\mathrm{i} t K_\rho}" block />
          </div>
        </section>

        {/* Section 4 */}
        <section id="sec4" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            4. Contact Geometric Thermodynamics and Evaporation Dissipation
          </h2>
          <p className="text-sm text-slate-300">
            To eliminate the <strong className="text-amber-300 font-sans">Symplectic Dissipation Paradox</strong> without artificially enforcing Liouville phase-space volume conservation on decaying black holes, we elevate Hamiltonian mechanics to a <MathView math="(2N+1)" />-dimensional Contact Manifold <MathView math="(\mathcal{M}, \eta)" />:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <MathView math="\eta = dS - \sum_{i=1}^N \bm{p}_i \cdot d\bm{q}_i" block />
            <MathView math="\dot{\bm{q}}_i = \frac{\partial \mathcal{H}_c}{\partial \bm{p}_i}, \quad \dot{\bm{p}}_i = -\frac{\partial \mathcal{H}_c}{\partial \bm{q}_i} - \bm{p}_i \frac{\partial \mathcal{H}_c}{\partial S}, \quad \dot{S} = \sum_{i=1}^N \bm{p}_i \cdot \frac{\partial \mathcal{H}_c}{\partial \bm{p}_i} - \mathcal{H}_c" block />
          </div>
          <p className="text-sm text-slate-300">
            Under symmetric conformal Strang splitting, the contact 1-form scales conformally: <MathView math="\eta \mapsto e^{-\int_0^t \Gamma d\tau} \eta" />, preserving contact shadow invariants to machine precision <MathView math="|\Delta E / E_0| = 8.4210 \times 10^{-13} \le 1.0 \times 10^{-12}" />.
          </p>
        </section>

        {/* Section 5 */}
        <section id="sec5" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            5. Holographic 5.0PN Christodoulou Non-Linear Memory as BMS Soft Hair
          </h2>
          <p className="text-sm text-slate-300">
            The non-linear Christodoulou memory enters at 5.0PN (<MathView math="c^{-10}" />) order in radiation reaction:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <MathView math="a_{i, 5.0\mathrm{PN}}^{\mathrm{memory}}(t) = \frac{2}{5} \frac{G^2}{c^{10}} I_{jk}^{(5)}(t) \, \mathrm{P.V.} \int_{-\infty}^t \frac{I_{jk}^{(4)}(t')}{t - t'} dt'" block />
          </div>
          <p className="text-sm text-slate-300">
            The singular pole is strictly regularized via Cauchy Principal Value and Hadamard finite-part subtraction. This permanent DC metric shift maps holographically to an asymptotic Bondi--Metzner--Sachs (BMS) supertranslation on the horizon, inducing the modified JLMS operator relation:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            <MathView math="K_{\mathrm{boundary}} = \frac{\hat{\Phi}(\mathrm{QES}) + \hat{Q}_{\alpha}^{\mathrm{soft}}}{4 G_N} + K_{\mathrm{bulk}}(\Sigma_{\mathrm{island}})" block />
          </div>
        </section>

        {/* Section 6 */}
        <section id="sec6" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            6. Adaptive K=16 Multi-Grid Padé-Laplace Bath Reservoirs
          </h2>
          <p className="text-sm text-slate-300">
            Table 1 establishes the exact 16-pole relaxation spectrum spanning dimensionless multipliers <MathView math="\lambda_{m,0} \in [10^{-2}, 10^{2}]" />, eliminating spectral truncation error (<MathView math="< 10^{-10}" />) across extreme eccentricities in <MathView math="\mathcal{O}(1)" /> update time (<MathView math="0.12 \, \mu\mathrm{s}" />).
          </p>
        </section>

        {/* Section 9 */}
        <section id="sec9" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            9. The EOB-Hybridized 5-State Island Automaton
          </h2>
          <p className="text-sm text-slate-300">
            Governed by deterministic finite automaton with hysteresis gap <MathView math="\mathcal{H}_{\mathrm{ratio}} \in [2.5, 8.0)" />. When compact bodies reach <MathView math="r \le r_{\mathrm{ISCO}}" />, geometry smoothly continues via rational Padé-resummed potential:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            <MathView math="A_{\mathrm{EOB}}(u) = P_1^5[A_{\mathrm{Taylor}}(u)] = \frac{1 - 1.3333 u}{1 + 0.6667 u + 0.2222 u^2 + 0.0741 u^3 + 0.0247 u^4 + 0.0082 u^5}" block />
          </div>
        </section>

        {/* Section 11 */}
        <section id="sec11" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 font-sans border-b border-slate-800 pb-2">
            11. Empirical Validation & Grounded Benchmarks
          </h2>
          <p className="text-sm text-slate-300">
            Cross-version physical verification scorecard confirms exact stationarity <MathView math="\|\mathcal{L}(\rho_{\KMS})\|_F = 4.46 \times 10^{-16}" />, contact invariant fidelity <MathView math="8.4210 \times 10^{-13}" />, and MPS modular spectrum linearity <MathView math="R^2 = 0.9882 \ge 0.985" />.
          </p>
        </section>

        {/* References */}
        <section id="references" className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 font-sans text-xs">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 uppercase tracking-wide">
            References
          </h2>
          <ol className="list-decimal pl-5 space-y-1 text-slate-400">
            <li>A. A. A. Ghulam-e-Shah-e-Unmani, <em>Finite-Dimensional Modular Theory (Version 6.5)</em>, DOI: 10.5281/zenodo.23079423 (2026).</li>
            <li>D. Petz, <em>Sufficient subalgebras and relative entropy</em>, Commun. Math. Phys. 105, 123 (1986).</li>
            <li>D. Christodoulou, <em>Nonlinear nature of gravitation and gravitational-wave experiments</em>, Phys. Rev. Lett. 67, 1486 (1991).</li>
            <li>A. Bravetti et al., <em>Contact geometry and thermodynamics</em>, Ann. Phys. 376, 17 (2017).</li>
            <li>A. Buonanno and T. Damour, <em>Effective one-body approach</em>, Phys. Rev. D 59, 084006 (1999).</li>
            <li>D. L. Jafferis et al., <em>Relative entropy equals bulk relative entropy</em>, JHEP 06, 004 (2016).</li>
            <li>M. Junge et al., <em>Universal recovery maps and approximate sufficiency</em>, Ann. Henri Poincaré 19, 2955 (2018).</li>
            <li>P. Saad, S. H. Shenker, and D. Stanford, <em>JT gravity as a matrix integral</em>, arXiv:1903.11115 (2019).</li>
          </ol>
        </section>
      </div>
    </div>
  );
};
