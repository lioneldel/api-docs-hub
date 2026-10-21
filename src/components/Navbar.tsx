import React from 'react';
import { Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenRecommender: () => void;
  onOpenMcpGuide: () => void;
  totalApis: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRecommender,
  onOpenMcpGuide,
  totalApis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-600 via-neon-purple to-neon-cyan flex items-center justify-center shadow-lg shadow-accent-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-surface-100 to-accent-200 bg-clip-text text-transparent">MINED BRAIN <span className="text-accent-400 font-bold">- API DOC DIRECTORY</span></span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/30">
                MCP Ready
              </span>
            </div>
            <p className="text-xs text-surface-300 hidden sm:block">
              Targeted LLM Documentation Directory & MCP Server
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs text-surface-300 bg-surface-900/60 px-3 py-1.5 rounded-lg border border-white/5">
            <Layers className="w-3.5 h-3.5 text-accent-400" />
            <span><strong className="text-white">{totalApis}</strong> Indexed APIs</span>
          </div>

          {/* AI Task Recommender Button */}
          <button
            onClick={onOpenRecommender}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-accent-600 to-neon-purple hover:from-accent-500 hover:to-neon-purple/90 text-white text-xs font-semibold shadow-md shadow-accent-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Recommender</span>
          </button>

          {/* MCP Server Connect */}
          <button
            onClick={onOpenMcpGuide}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl glass-panel glass-panel-hover text-surface-200 hover:text-white text-xs font-medium transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-neon-green" />
            <span>Connect MCP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
