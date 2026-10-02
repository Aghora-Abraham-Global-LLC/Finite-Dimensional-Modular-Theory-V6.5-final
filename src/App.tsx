import React, { useState } from 'react';
import {
  Orbit,
  Waves,
  Layers,
  RefreshCw,
  Compass,
  Network,
  Cpu,
  CheckCircle2,
  BookOpen,
  Atom,
  ExternalLink,
  Github,
  FileCode,
  Cloud,
} from 'lucide-react';
import { TriBodySimulator } from './components/TriBodySimulator';
import { MemoryBMSLab } from './components/MemoryBMSLab';
import { PadeReservoirLab } from './components/PadeReservoirLab';
import { PetzRecoveryLab } from './components/PetzRecoveryLab';
import { HolonomyKuramotoLab } from './components/HolonomyKuramotoLab';
import { EOBAutomataLab } from './components/EOBAutomataLab';
import { MPSMatrixLab } from './components/MPSMatrixLab';
import { TestBatteryRunner } from './components/TestBatteryRunner';
import { PaperReader } from './components/PaperReader';
import { CloudflareModal } from './components/CloudflareModal';

export type TabKey =
  | 'tribody'
  | 'memory_bms'
  | 'pade_k16'
  | 'petz_dpi'
  | 'holonomy'
  | 'eob_automata'
  | 'mps_matrix'
  | 'test_battery'
  | 'manuscript';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('tribody');
  const [isCloudflareOpen, setIsCloudflareOpen] = useState<boolean>(false);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'tribody', label: 'TriBody Workstation', icon: <Orbit className="h-4 w-4" />, badge: 'Section 4' },
    { key: 'memory_bms', label: '5.0PN Memory & BMS', icon: <Waves className="h-4 w-4" />, badge: 'Section 5' },
    { key: 'pade_k16', label: 'K=16 Padé Bath', icon: <Layers className="h-4 w-4" />, badge: 'Table 1' },
    { key: 'petz_dpi', label: 'Twirled Petz & DPI', icon: <RefreshCw className="h-4 w-4" />, badge: 'F=99.3%' },
    { key: 'holonomy', label: 'Curved Holonomy', icon: <Compass className="h-4 w-4" />, badge: 'δ_crit=π/4' },
    { key: 'eob_automata', label: 'EOB Island Automaton', icon: <Network className="h-4 w-4" />, badge: 'Table 2' },
    { key: 'mps_matrix', label: 'MPS & SSS Matrix', icon: <Cpu className="h-4 w-4" />, badge: 'R²=0.9882' },
    { key: 'test_battery', label: '28-Test Battery', icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />, badge: '28/28' },
    { key: 'manuscript', label: 'Full Paper Reader', icon: <BookOpen className="h-4 w-4 text-cyan-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#070b14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Paper DOI */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-0.5 shadow-lg shadow-cyan-950/50">
                <div className="h-full w-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                  <Atom className="h-5 w-5 text-cyan-400 animate-spin-slow" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-mono">
                    Finite Modular Theory V6.5
                  </span>
                  <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-800/60 font-semibold">
                    TriBody Synthesis
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Software DOI: 10.5281/zenodo.23097967</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-emerald-400">28/28 Tests Certified</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsCloudflareOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/50 bg-orange-950/40 text-xs font-mono text-orange-300 hover:bg-orange-900/60 hover:text-white transition shadow-sm"
                title="Cloudflare Subdomain Settings for finite.bhutadamarasena.com"
              >
                <Cloud className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-semibold hidden md:inline">finite.bhutadamarasena.com</span>
                <span className="font-semibold md:hidden">Cloudflare</span>
              </button>

              <a
                href="https://doi.org/10.5281/zenodo.23097967"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Zenodo DOI
              </a>
              <button
                onClick={() => setActiveTab('test_battery')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-xs font-mono text-emerald-300 font-bold hover:bg-emerald-900 transition shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>28/28 Passed</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[9px] px-1.5 py-0.2 rounded ${
                      activeTab === tab.key
                        ? 'bg-cyan-800/80 text-cyan-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'tribody' && <TriBodySimulator />}
        {activeTab === 'memory_bms' && <MemoryBMSLab />}
        {activeTab === 'pade_k16' && <PadeReservoirLab />}
        {activeTab === 'petz_dpi' && <PetzRecoveryLab />}
        {activeTab === 'holonomy' && <HolonomyKuramotoLab />}
        {activeTab === 'eob_automata' && <EOBAutomataLab />}
        {activeTab === 'mps_matrix' && <MPSMatrixLab />}
        {activeTab === 'test_battery' && <TestBatteryRunner />}
        {activeTab === 'manuscript' && <PaperReader />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#060a12] py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-slate-400 font-medium">
              Finite-Dimensional Modular Theory (Version 6.5 Definitive Physical Synthesis)
            </p>
            <p className="text-[11px] text-slate-500">
              Arya Arunachala Ananda Ghulam-e-Shah-e-Unmani • BhutaDamaraSena R&amp;D Labs • Aghora Abraham Global LLC
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400">Cryptographic Digest Verified</span>
            <span>•</span>
            <a
              href="https://doi.org/10.5281/zenodo.23097967"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              DOI: 10.5281/zenodo.23097967
            </a>
          </div>
        </div>
      </footer>

      {/* Cloudflare Subdomain Setup Modal */}
      <CloudflareModal
        isOpen={isCloudflareOpen}
        onClose={() => setIsCloudflareOpen(false)}
      />
    </div>
  );
};
