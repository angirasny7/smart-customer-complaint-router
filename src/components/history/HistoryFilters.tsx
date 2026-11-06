import React from 'react';
import { Search, X } from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '../../config/categories';

interface HistoryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onReset: () => void;
  totalFiltered: number;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedModel,
  onModelChange,
  onReset,
  totalFiltered,
}) => {
  const isFiltered = searchQuery || selectedCategory !== 'ALL' || selectedModel !== 'ALL';

  return (
    <div className="bg-white p-4 rounded-xl border border-[#E7E5F2] shadow-[0_1px_3px_rgba(23,26,53,0.04)] space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#475467] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search complaint text, department, category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-base text-[#171A35] placeholder:text-[#475467]/70 bg-[#F8F9FC] border border-[#E7E5F2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475467] hover:text-[#171A35]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="sm:w-44">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-[14px] font-medium text-[#171A35] bg-[#F8F9FC] border border-[#E7E5F2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#635BFF] cursor-pointer"
          >
            <option value="ALL">All Categories (11)</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div className="sm:w-40">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full px-3 py-2 text-[14px] font-medium text-[#171A35] bg-[#F8F9FC] border border-[#E7E5F2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#635BFF] cursor-pointer"
          >
            <option value="ALL">All Models</option>
            <option value="distilbert">DistilBERT</option>
            <option value="logistic_regression">LogReg</option>
          </select>
        </div>

        {/* Reset Filter */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[14px] font-semibold text-[#475467] hover:text-[#171A35] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[13px] text-[#475467] px-0.5">
        <span>
          Showing <strong className="text-[#171A35] font-semibold">{totalFiltered}</strong> matching records
        </span>
        {isFiltered && <span className="text-[#635BFF] font-semibold">Filtered</span>}
      </div>
    </div>
  );
};
