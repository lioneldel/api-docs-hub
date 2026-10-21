import React from 'react';
import { CategoryInfo } from '../types/api';

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  totalApis: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalApis,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center space-x-2 min-w-max px-1">
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/30 border border-accent-400/40'
              : 'glass-panel text-surface-300 hover:text-white hover:bg-surface-800/60'
          }`}
        >
          <span>🌐</span>
          <span>All APIs</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-surface-800 text-surface-400'
            }`}
          >
            {totalApis}
          </span>
        </button>

        {/* Individual Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/30 border border-accent-400/40 font-semibold'
                  : 'glass-panel text-surface-300 hover:text-white hover:bg-surface-800/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-800 text-surface-400'
                }`}
              >
                {cat.apiCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
