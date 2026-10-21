import React, { useState } from 'react';
import { ApiEntry } from '../types/api';
import {
  X,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Shield,
  Coins,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ApiDetailModalProps {
  api: ApiEntry | null;
  onClose: () => void;
  onSelectAlternative?: (altId: string) => void;
}

export const ApiDetailModal: React.FC<ApiDetailModalProps> = ({
  api,
  onClose,
  onSelectAlternative,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'auth' | 'quickstart' | 'sdks'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!api) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30';
      case 'POST':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'PUT':
      case 'PATCH':
        return 'bg-neon-orange/20 text-neon-orange border-neon-orange/30';
      case 'DELETE':
        return 'bg-neon-pink/20 text-neon-pink border-neon-pink/30';
      default:
        return 'bg-surface-700 text-surface-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-modal rounded-3xl shadow-2xl flex flex-col border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-surface-900/50">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-accent-600/30 text-accent-300 border border-accent-500/30">
                {api.category}
              </span>
              <span className="text-xs text-surface-400">
                Updated {api.lastUpdated}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <span>{api.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-surface-300 mt-1 max-w-2xl leading-relaxed">
              {api.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={api.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium transition-all shadow-md shadow-accent-600/20"
            >
              <span>Official Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-surface-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center space-x-1 px-6 border-b border-white/10 bg-surface-950/40 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Use Cases' },
            { id: 'endpoints', label: `Endpoints (${api.endpoints.length})` },
            { id: 'auth', label: 'Authentication & Base URL' },
            { id: 'quickstart', label: 'Quickstart Code' },
            { id: 'sdks', label: `SDKs (${api.sdks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent-500 text-white font-semibold'
                  : 'border-transparent text-surface-400 hover:text-surface-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="glass-panel p-3.5 rounded-xl">
                  <div className="text-[11px] text-surface-400 flex items-center space-x-1 mb-1">
                    <Shield className="w-3.5 h-3.5 text-accent-400" />
                    <span>Auth Method</span>
                  </div>
                  <div className="text-sm font-semibold text-white capitalize">{api.authMethod}</div>
                </div>

                <div className="glass-panel p-3.5 rounded-xl">
                  <div className="text-[11px] text-surface-400 flex items-center space-x-1 mb-1">
                    <Coins className="w-3.5 h-3.5 text-neon-green" />
                    <span>Pricing Model</span>
                  </div>
                  <div className="text-sm font-semibold text-white capitalize">{api.pricing}</div>
                  <div className="text-[11px] text-surface-300 mt-0.5">{api.pricingDetails}</div>
                </div>

                <div className="glass-panel p-3.5 rounded-xl">
                  <div className="text-[11px] text-surface-400 flex items-center space-x-1 mb-1">
                    <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>Base API URL</span>
                  </div>
                  <div className="text-xs font-mono text-accent-300 truncate">{api.baseUrl}</div>
                </div>
              </div>

              {/* Primary Use Cases */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-300 mb-2">
                  Recommended For
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {api.useCases.map((uc) => (
                    <div
                      key={uc}
                      className="flex items-center space-x-2 p-2.5 rounded-xl bg-surface-900/60 border border-white/5 text-xs text-surface-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives */}
              {api.alternatives.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-300 mb-2">
                    Alternative Solutions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {api.alternatives.map((alt) => (
                      <button
                        key={alt}
                        onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                        className="px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-xs text-surface-300 hover:text-white border border-white/10 flex items-center space-x-1 transition-all"
                      >
                        <span>{alt}</span>
                        <ArrowRight className="w-3 h-3 text-surface-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ENDPOINTS TAB */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              {api.endpoints.map((ep, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border ${getMethodColor(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-sm font-mono text-white font-medium">{ep.path}</span>
                    </div>
                    <span className="text-xs font-semibold text-accent-300">{ep.summary}</span>
                  </div>

                  <p className="text-xs text-surface-300">{ep.description}</p>

                  {ep.parameters && ep.parameters.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/5">
                      <div className="text-[11px] font-semibold text-surface-400 mb-1.5">
                        Parameters
                      </div>
                      <div className="space-y-1">
                        {ep.parameters.map((p) => (
                          <div
                            key={p.name}
                            className="text-xs flex items-baseline space-x-2 font-mono"
                          >
                            <span className="text-neon-cyan font-medium">{p.name}</span>
                            <span className="text-surface-500 text-[11px]">({p.type})</span>
                            {p.required && (
                              <span className="text-[10px] text-neon-pink uppercase">required</span>
                            )}
                            <span className="text-surface-300 font-sans text-[11px]">
                              — {p.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ep.responseExample && (
                    <div className="mt-2">
                      <div className="text-[11px] font-semibold text-surface-400 mb-1">
                        Example Response
                      </div>
                      <pre className="p-3 rounded-xl bg-surface-950/80 border border-white/5 text-[11px] text-surface-200 overflow-x-auto">
                        <code>{ep.responseExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AUTH TAB */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-2xl space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-accent-400" />
                  <span>Authentication Setup</span>
                </h4>
                <p className="text-xs text-surface-300 leading-relaxed">
                  {api.authSetupGuide}
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-surface-400">Base URL</h4>
                  <button
                    onClick={() => handleCopy(api.baseUrl)}
                    className="text-xs text-accent-400 hover:text-accent-300 flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-surface-950 font-mono text-xs text-accent-300 border border-white/5">
                  {api.baseUrl}
                </div>
              </div>
            </div>
          )}

          {/* QUICKSTART TAB */}
          {activeTab === 'quickstart' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">
                  Ready-to-use TypeScript/JavaScript snippet
                </span>
                <button
                  onClick={() => handleCopy(api.quickstart)}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-xs text-white transition-all border border-white/10"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neon-green" />
                      <span className="text-neon-green">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-surface-950 border border-white/10 text-xs text-surface-100 overflow-x-auto leading-relaxed">
                <code>{api.quickstart}</code>
              </pre>
            </div>
          )}

          {/* SDKS TAB */}
          {activeTab === 'sdks' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {api.sdks.map((sdk) => (
                <div key={sdk.language} className="glass-panel p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{sdk.language}</span>
                    <button
                      onClick={() => handleCopy(sdk.installCommand)}
                      className="p-1 text-surface-400 hover:text-white"
                      title="Copy install command"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-surface-400">Package: <code className="text-surface-200">{sdk.package}</code></p>
                  <pre className="p-2.5 rounded-xl bg-surface-950 border border-white/5 text-[11px] font-mono text-neon-green">
                    <code>{sdk.installCommand}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
