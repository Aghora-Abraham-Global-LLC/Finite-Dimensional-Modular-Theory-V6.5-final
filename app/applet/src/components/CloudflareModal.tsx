import React, { useState } from 'react';
import { Cloud, Copy, Check, ExternalLink, Globe, ShieldCheck, Terminal, Server, ArrowRight, X } from 'lucide-react';

interface CloudflareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareModal: React.FC<CloudflareModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const subdomain = 'finite.bhutadamarasena.com';
  const apexDomain = 'bhutadamarasena.com';
  const cnameRecord = 'finite';
  const cnameTarget = 'finite-bhutadamarasena-com.pages.dev';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#0b1120] p-6 shadow-2xl space-y-5 text-slate-200 font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Cloudflare Subdomain Configuration
                </h3>
                <span className="rounded bg-orange-950/80 px-2 py-0.5 text-[10px] font-mono text-orange-300 border border-orange-800/80 font-semibold">
                  Pages Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: <span className="text-cyan-400 font-bold">{subdomain}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>SPA Routing (_redirects) and Headers (_headers) Configured</span>
          </div>
          <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700/60">
            Auto-Configured
          </span>
        </div>

        {/* Section 1: DNS Records to Add in Cloudflare Dashboard */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-cyan-400" />
            1. Cloudflare DNS Configuration
          </span>
          <p className="text-xs text-slate-400">
            In your Cloudflare dashboard for zone <strong className="text-slate-200 font-mono">{apexDomain}</strong>, add or verify this DNS record:
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs space-y-2">
            <div className="grid grid-cols-4 gap-2 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800 pb-1.5">
              <span>Type</span>
              <span>Name</span>
              <span className="col-span-2">Target / Content</span>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center text-slate-200 text-xs">
              <span className="text-amber-400 font-bold">CNAME</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                {cnameRecord}
                <button
                  onClick={() => copyToClipboard(cnameRecord, 'name')}
                  className="text-slate-500 hover:text-slate-300"
                  title="Copy name"
                >
                  {copiedKey === 'name' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </span>
              <span className="col-span-2 text-slate-300 flex items-center justify-between">
                <span className="truncate">{cnameTarget}</span>
                <button
                  onClick={() => copyToClipboard(cnameTarget, 'target')}
                  className="text-slate-500 hover:text-slate-300 ml-2"
                  title="Copy target"
                >
                  {copiedKey === 'target' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </span>
            </div>
            <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900">
              <span className="flex items-center gap-1 text-orange-400">
                <span>Proxy status:</span>
                <span className="rounded bg-orange-950/80 text-orange-300 px-1.5 py-0.2 border border-orange-800/80 font-bold">
                  Proxied (Orange Cloud)
                </span>
              </span>
              <span>SSL/TLS: Full (Strict)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cloudflare Pages Step-by-Step */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
            <Server className="h-4 w-4 text-orange-400" />
            2. Connect Custom Domain in Cloudflare Pages
          </span>
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">1</span>
              <span>Open Cloudflare Dashboard → <strong>Workers &amp; Pages</strong> → Select project <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">finite-bhutadamarasena-com</code>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">2</span>
              <span>Click <strong>Custom domains</strong> tab → <strong>Set up a custom domain</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">3</span>
              <span>Enter <code className="text-cyan-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded font-bold">{subdomain}</code> and click Continue.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">4</span>
              <span>Cloudflare validates the DNS record automatically and activates the Universal SSL certificate.</span>
            </div>
          </div>
        </div>

        {/* Section 3: Wrangler CLI Deploy Command */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-emerald-400" />
            3. CLI Deploy with Cloudflare Wrangler
          </span>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Direct Build &amp; Deploy:</span>
              <button
                onClick={() => copyToClipboard('npm run build && npx wrangler pages deploy dist --project-name=finite-bhutadamarasena-com', 'cmd')}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[11px]"
              >
                {copiedKey === 'cmd' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === 'cmd' ? 'Copied Command!' : 'Copy Command'}</span>
              </button>
            </div>
            <pre className="bg-[#030712] p-2.5 rounded border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
npm run build && npx wrangler pages deploy dist --project-name=finite-bhutadamarasena-com
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            <span>Open Cloudflare Dashboard</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-cyan-900/40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
