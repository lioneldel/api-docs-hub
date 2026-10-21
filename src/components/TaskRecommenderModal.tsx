import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  Key,
  ShieldCheck,
  Cpu,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { recommendWithGemini } from '../data/gemini-recommender';
import { ApiRecommendation, ApiEntry } from '../types/api';

interface TaskRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApi: (api: ApiEntry) => void;
}

const DEFAULT_KEY = (import.meta as any)?.env?.VITE_GEMINI_API_KEY || '';

export const TaskRecommenderModal: React.FC<TaskRecommenderModalProps> = ({
  isOpen,
  onClose,
  onSelectApi,
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('api_hub_gemini_key') || DEFAULT_KEY;
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    source: 'gemini' | 'local';
    analysis: string;
    expectedOutcome: string;
    recommendations: ApiRecommendation[];
  } | null>(null);

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tempKey.trim();
    setApiKey(trimmed || DEFAULT_KEY);
    localStorage.setItem('api_hub_gemini_key', trimmed || DEFAULT_KEY);
    setShowKeyModal(false);
  };

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setIsLoading(true);
    try {
      const res = await recommendWithGemini(taskInput, apiKey);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleTasks = [
    'Build an AI powered real-estate platform with Stripe billing and Google Maps',
    'Create a Next.js B2B SaaS with team auth, email alerts, and Postgres database',
    'Voice assistant app with sub-second low-latency AI responses and audio synthesis',
    'Crypto trading & portfolio tracker with Binance API and Discord webhook alerts',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-modal rounded-3xl shadow-2xl flex flex-col border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 via-neon-purple to-neon-cyan flex items-center justify-center shadow-lg shadow-accent-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">AI Task Recommender</h2>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 flex items-center space-x-1">
                  <Cpu className="w-3 h-3" />
                  <span>Powered by Gemini 3.8 Flash</span>
                </span>
              </div>
              <p className="text-xs text-surface-300">
                Input your task requirements to generate the exact API stack &amp; architectural blueprint
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Key Status / Config Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface-900/80 hover:bg-surface-800 text-surface-200 hover:text-white border border-white/10 text-xs font-medium transition-all"
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-accent-400" />
              <span className="hidden sm:inline">Gemini Key:</span>
              <span className="font-mono text-neon-green text-[11px]">
                {apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : 'Set Key'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-surface-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gemini API Key Modal Overlay */}
        {showKeyModal && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-accent-500/40 shadow-2xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white font-bold text-base">
                  <Key className="w-4 h-4 text-accent-400" />
                  <span>Configure Gemini API Key</span>
                </div>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="p-1 text-surface-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-surface-300 leading-relaxed">
                Your key is used to invoke Google Gemini 3.8 Flash for deep architectural recommendations across our 3,910+ APIs.
              </p>

              <form onSubmit={handleSaveKey} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-surface-400">Gemini API Key</label>
                  <input
                    type="text"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="AQ.Ab8... or AIzaSy..."
                    className="w-full px-3 py-2 rounded-xl bg-surface-950 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-accent-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempKey(DEFAULT_KEY);
                      setApiKey(DEFAULT_KEY);
                      localStorage.setItem('api_hub_gemini_key', DEFAULT_KEY);
                      setShowKeyModal(false);
                    }}
                    className="text-[11px] text-surface-400 hover:text-accent-300 underline"
                  >
                    Reset to Default Key
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowKeyModal(false)}
                      className="px-3 py-1.5 rounded-xl bg-surface-900 text-surface-300 text-xs font-medium hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-semibold shadow-md shadow-accent-600/30"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Form */}
          <form onSubmit={handleRecommend} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Describe what you are building (e.g. 'I want to build a real estate investment portal with user logins, map search, image uploads, and Stripe subscription billing')..."
                className="w-full glass-panel rounded-2xl p-4 text-sm text-white placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 resize-none transition-all"
              />
              <button
                type="submit"
                disabled={!taskInput.trim() || isLoading}
                className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-600 via-neon-purple to-neon-cyan hover:opacity-95 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-accent-600/30 flex items-center space-x-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini 3.8 Flash Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze with Gemini</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Predefined prompt pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-surface-400">Try these:</span>
              {sampleTasks.map((task) => (
                <button
                  key={task}
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setTaskInput(task);
                    setIsLoading(true);
                    try {
                      const res = await recommendWithGemini(task, apiKey);
                      setResults(res);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-900 hover:bg-accent-500/20 text-surface-300 hover:text-accent-300 border border-white/5 text-[11px] transition-all disabled:opacity-50"
                >
                  {task.slice(0, 36)}...
                </button>
              ))}
            </div>
          </form>

          {/* Results Display */}
          {results && (
            <div className="space-y-6 border-t border-white/10 pt-6 animate-slide-up">
              {/* Badge showing engine source */}
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface-900 text-surface-300 border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
                  <span>
                    Analysis Engine: <strong className="text-white capitalize">{results.source === 'gemini' ? 'Google Gemini 3.8 Flash' : 'Local Heuristic Engine'}</strong>
                  </span>
                </span>
                <span className="text-surface-400 text-[11px]">
                  {results.recommendations.length} APIs Recommended
                </span>
              </div>

              {/* Expected Outcome Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-950/60 to-surface-900/80 border border-accent-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-accent-300">
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                  <span>Expected Architectural Outcome</span>
                </div>
                <p className="text-xs sm:text-sm text-surface-100 leading-relaxed font-medium">
                  {results.expectedOutcome}
                </p>
                <div className="text-[11px] text-surface-400 pt-1 leading-relaxed border-t border-white/5 mt-2">
                  <strong className="text-surface-300">Technical Analysis:</strong> {results.analysis}
                </div>
              </div>

              {/* Recommended Stack */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-accent-400" />
                  <span>Required &amp; Recommended API Stack</span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {results.recommendations.map((rec, i) => (
                    <div
                      key={rec.api.id}
                      onClick={() => {
                        onClose();
                        onSelectApi(rec.api);
                      }}
                      className="glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer border border-white/5 hover:border-accent-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{rec.api.name}</span>
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md ${
                              rec.relevance === 'essential'
                                ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                                : 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                            }`}
                          >
                            {rec.relevance}
                          </span>
                          <span className="text-xs text-surface-400 capitalize">
                            • {rec.api.category}
                          </span>
                        </div>

                        <p className="text-xs text-accent-200 font-medium">
                          <strong>Why Needed:</strong> {rec.reason}
                        </p>

                        <p className="text-xs text-surface-300">
                          <strong>Integration Blueprint:</strong> {rec.integrationNotes}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-surface-400 self-end sm:self-center">
                        <span className="text-[11px]">View Docs</span>
                        <ChevronRight className="w-4 h-4 text-accent-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
