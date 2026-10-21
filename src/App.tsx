import React, { useState, useMemo } from 'react';
import { ALL_APIS, CATEGORIES_WITH_COUNTS } from './data/registry';
import { searchApis } from './data/search-index';
import { ApiEntry } from './types/api';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ApiCard } from './components/ApiCard';
import { ApiDetailModal } from './components/ApiDetailModal';
import { TaskRecommenderModal } from './components/TaskRecommenderModal';
import { McpGuideModal } from './components/McpGuideModal';
import { ApiComparisonModal } from './components/ApiComparisonModal';
import { Sparkles, Terminal, Scale, Layers, Zap, ExternalLink, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedApi, setSelectedApi] = useState<ApiEntry | null>(null);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [isMcpGuideOpen, setIsMcpGuideOpen] = useState(false);
  const [comparedApiIds, setComparedApiIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Search results
  const searchResults = useMemo(() => {
    return searchApis(query, selectedCategory, 100);
  }, [query, selectedCategory]);

  const toggleCompare = (apiId: string) => {
    setComparedApiIds((prev) =>
      prev.includes(apiId) ? prev.filter((id) => id !== apiId) : [...prev, apiId]
    );
  };

  return (
    <div className="min-h-screen bg-[#08080e] text-[#f1f1f7] flex flex-col selection:bg-accent-500/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[400px] bg-neon-cyan/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 -right-40 w-[500px] h-[400px] bg-neon-purple/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation */}
      <Navbar
        onOpenRecommender={() => setIsRecommenderOpen(true)}
        onOpenMcpGuide={() => setIsMcpGuideOpen(true)}
        totalApis={ALL_APIS.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface-900/80 border border-white/10 text-xs text-accent-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-pulse" />
            <span>Targeted Documentation Directory for Humans &amp; AI Agents</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Find the Right{' '}
            <span className="bg-gradient-to-r from-accent-400 via-neon-purple to-neon-cyan bg-clip-text text-transparent">
              APIs &amp; Docs
            </span>{' '}
            for Any Task
          </h1>

          <p className="text-sm sm:text-base text-surface-300 leading-relaxed max-w-2xl mx-auto">
            Explore 100+ production APIs with curated schemas, auth blueprints, and quickstarts.
            Connect our <strong>MCP Server</strong> so your LLM automatically fetches targeted documentation and architectural blueprints.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={CATEGORIES_WITH_COUNTS}
          onOpenRecommender={() => setIsRecommenderOpen(true)}
        />

        {/* Category Filters */}
        <CategoryFilter
          categories={CATEGORIES_WITH_COUNTS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalApis={ALL_APIS.length}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-surface-400 px-1 border-b border-white/5 pb-3">
          <div>
            Showing <strong className="text-white">{searchResults.length}</strong> APIs
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-accent-300 capitalize">{selectedCategory}</strong></span>
            )}
            {query && (
              <span> matching &ldquo;<span className="text-white">{query}</span>&rdquo;</span>
            )}
          </div>

          {comparedApiIds.length > 0 && (
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="flex items-center space-x-1.5 text-accent-400 hover:text-accent-300 font-semibold"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Selected ({comparedApiIds.length})</span>
            </button>
          )}
        </div>

        {/* API Cards Grid */}
        {searchResults.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
            <p className="text-surface-300 text-sm">
              No APIs found matching &ldquo;{query}&rdquo;.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-medium transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {searchResults.map(({ api }) => (
              <ApiCard
                key={api.id}
                api={api}
                onSelect={(selected) => setSelectedApi(selected)}
                onCompareToggle={toggleCompare}
                isCompared={comparedApiIds.includes(api.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Compare Bar */}
      {comparedApiIds.length > 0 && (
        <aside aria-label="Comparison dock" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-modal px-5 py-3 rounded-2xl shadow-2xl border border-accent-500/40 flex items-center space-x-4 animate-slide-up">
          <div className="flex items-center space-x-2 text-xs">
            <Scale className="w-4 h-4 text-neon-cyan" />
            <span><strong className="text-white">{comparedApiIds.length}</strong> APIs queued for comparison</span>
          </div>
          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-semibold shadow-md shadow-accent-600/30 transition-all"
          >
            Compare Now
          </button>
        </aside>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 glass-panel py-8 px-4 text-center text-xs text-surface-400 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button onClick={() => setIsRecommenderOpen(true)} className="hover:text-white transition-colors">
            AI Task Recommender
          </button>
          <button onClick={() => setIsMcpGuideOpen(true)} className="hover:text-white transition-colors">
            MCP Integration Guide
          </button>
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center space-x-1">
            <span>Model Context Protocol</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-surface-500 text-[11px]">
          API Docs Hub &bull; Empowering Developers and AI Agents with Clean, Targeted API Intelligence.
        </p>
      </footer>

      {/* Modals */}
      <ApiDetailModal
        api={selectedApi}
        onClose={() => setSelectedApi(null)}
        onSelectAlternative={(altId) => {
          const alt = ALL_APIS.find((a) => a.id === altId);
          if (alt) setSelectedApi(alt);
        }}
      />

      <TaskRecommenderModal
        isOpen={isRecommenderOpen}
        onClose={() => setIsRecommenderOpen(false)}
        onSelectApi={(api) => setSelectedApi(api)}
      />

      <McpGuideModal
        isOpen={isMcpGuideOpen}
        onClose={() => setIsMcpGuideOpen(false)}
      />

      <ApiComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedIds={comparedApiIds}
        onRemoveId={(id) => setComparedApiIds((prev) => prev.filter((i) => i !== id))}
        onClearAll={() => setComparedApiIds([])}
      />
    </div>
  );
};
