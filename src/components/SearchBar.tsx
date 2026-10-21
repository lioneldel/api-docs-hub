import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, Filter } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: { id: string; name: string }[];
  onOpenRecommender: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onOpenRecommender,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sampleSearches = [
    'Stripe Checkout',
    'OpenAI Embeddings',
    'Clerk Auth Next.js',
    'Postgres RLS',
    'Twilio SMS',
    'Cloudflare R2 Storage',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Search Input Box */}
      <div className="relative flex items-center glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl focus-within:border-accent-500/60 focus-within:ring-2 focus-within:ring-accent-500/20 transition-all">
        {/* Search Icon */}
        <div className="pl-3 pr-2 text-surface-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search 100+ APIs by name, capability, endpoint, or SDK (e.g. 'Stripe subscriptions', 'Claude 3.7', 'S3 upload')..."
          className="w-full bg-transparent text-sm md:text-base text-white placeholder-surface-400 focus:outline-none px-2 py-2"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="p-1.5 text-surface-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Category Dropdown */}
        <div className="hidden sm:flex items-center space-x-1 pl-2 pr-1 border-l border-white/10">
          <Filter className="w-3.5 h-3.5 text-surface-400" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-transparent text-xs text-surface-200 focus:outline-none cursor-pointer py-1 pr-2"
          >
            <option value="all" className="bg-surface-900 text-white">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-surface-900 text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shortcut Badge */}
        <div className="hidden md:flex items-center pr-2 pl-1">
          <kbd className="px-2 py-1 text-[11px] font-mono text-surface-400 bg-surface-800/80 rounded border border-white/10">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Suggested Quick Searches & Recommender Callout */}
      <div className="flex flex-wrap items-center justify-between text-xs text-surface-400 gap-2 px-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-surface-500 font-medium">Quick find:</span>
          {sampleSearches.map((s) => (
            <button
              key={s}
              onClick={() => onQueryChange(s)}
              className="px-2.5 py-1 rounded-lg bg-surface-900/60 hover:bg-accent-500/20 hover:text-accent-300 border border-white/5 text-[11px] transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenRecommender}
          className="inline-flex items-center space-x-1 text-accent-400 hover:text-accent-300 transition-colors ml-auto font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Need API advice for a task?</span>
        </button>
      </div>
    </div>
  );
};
