import React from 'react';
import { X, Scale, Trash2 } from 'lucide-react';
import { compareApis } from '../data/search-index';
import { getApiById } from '../data/registry';

interface ApiComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedIds: string[];
  onRemoveId: (id: string) => void;
  onClearAll: () => void;
}

export const ApiComparisonModal: React.FC<ApiComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedIds,
  onRemoveId,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const comparison = compareApis(comparedIds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-modal rounded-3xl shadow-2xl flex flex-col border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compare APIs Side-by-Side</h2>
              <p className="text-xs text-surface-300">
                Comparing {comparedIds.length} APIs on auth, pricing, architecture, and SDKs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {comparedIds.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-xs text-surface-300 hover:text-white transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-neon-pink" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-surface-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {comparedIds.length < 2 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-surface-300 text-sm">
                Select at least 2 APIs using the <span className="text-accent-300 font-semibold">+ Compare</span> button on any API card.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 text-surface-400 uppercase tracking-wider font-semibold w-40">
                      Feature
                    </th>
                    {comparison.apiIds.map((id) => {
                      const api = getApiById(id);
                      return (
                        <th key={id} className="p-3 text-white font-bold text-sm min-w-[200px]">
                          <div className="flex items-center justify-between">
                            <span>{api?.name || id}</span>
                            <button
                              onClick={() => onRemoveId(id)}
                              className="text-surface-500 hover:text-neon-pink p-1"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparison.criteria.map((crit) => (
                    <tr key={crit.name} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-semibold text-surface-300 align-top">
                        {crit.name}
                      </td>
                      {comparison.apiIds.map((id) => (
                        <td key={id} className="p-3 text-surface-200 align-top leading-relaxed">
                          {crit.values[id] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
