import React, { useState } from 'react';
import { ApiEntry } from '../types/api';
import {
  ExternalLink,
  Code2,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Coins,
  Cpu,
} from 'lucide-react';

interface ApiCardProps {
  api: ApiEntry;
  onSelect: (api: ApiEntry) => void;
  onCompareToggle?: (apiId: string) => void;
  isCompared?: boolean;
}

export const ApiCard: React.FC<ApiCardProps> = ({
  api,
  onSelect,
  onCompareToggle,
  isCompared,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyQuickstart = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(api.quickstart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPricingBadgeColor = (pricing: string) => {
    switch (pricing) {
      case 'free':
        return 'bg-neon-green/10 text-neon-green border-neon-green/30';
      case 'freemium':
        return 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30';
      case 'pay-as-you-go':
        return 'bg-accent-500/10 text-accent-300 border-accent-500/30';
      default:
        return 'bg-surface-800 text-surface-300 border-white/10';
    }
  };

  return (
    <div
      onClick={() => onSelect(api)}
      className="group relative glass-panel glass-panel-hover rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between border border-white/5 hover:border-accent-500/40"
    >
      {/* Top row: Category, pricing badge, compare checkbox */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-lg bg-surface-900/80 text-surface-300 border border-white/5">
              {api.category}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${getPricingBadgeColor(
                api.pricing
              )}`}
            >
              {api.pricing}
            </span>
          </div>

          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle(api.id);
              }}
              title="Compare API"
              className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                isCompared
                  ? 'bg-accent-600 text-white border-accent-500'
                  : 'bg-surface-900/60 text-surface-400 border-white/5 hover:text-white'
              }`}
            >
              {isCompared ? 'Comparing' : '+ Compare'}
            </button>
          )}
        </div>

        {/* API Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-accent-300 transition-colors flex items-center justify-between">
          <span>{api.name}</span>
          <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all" />
        </h3>

        {/* Short description */}
        <p className="text-xs text-surface-300 line-clamp-2 mt-2 leading-relaxed">
          {api.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {api.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-surface-400 border border-white/[0.03]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Metadata & Actions */}
      <div className="mt-5 pt-3 border-t border-white/5 space-y-3">
        {/* Auth & SDK indicators */}
        <div className="flex items-center justify-between text-[11px] text-surface-400">
          <div className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-accent-400" />
            <span>{api.authMethod}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
            <span>{api.sdks.length} SDKs</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyQuickstart}
            className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-surface-900/70 hover:bg-surface-800 text-surface-200 hover:text-white text-xs font-medium border border-white/5 transition-all"
            title="Copy quickstart code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-neon-green">Copied Code</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5 text-surface-400" />
                <span>Quickstart</span>
              </>
            )}
          </button>

          <a
            href={api.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-xl bg-surface-900/70 hover:bg-surface-800 text-surface-400 hover:text-white border border-white/5 transition-all"
            title="Open official documentation"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
