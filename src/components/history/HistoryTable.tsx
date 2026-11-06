import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, Inbox, Trash2 } from 'lucide-react';
import type { ComplaintRecord } from '../../types/complaint';
import { getCategoryInfo } from '../../config/categories';

interface HistoryTableProps {
  records: ComplaintRecord[];
  onClearHistory: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, onClearHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pageSize = 8;

  const totalPages = Math.ceil(records.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentRecords = records.slice(startIndex, startIndex + pageSize);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E7E5F2] p-10 text-center shadow-[0_1px_3px_rgba(23,26,53,0.04)]">
        <Inbox className="w-8 h-8 text-[#8E98B0] mx-auto mb-2" />
        <h4 className="text-xs font-semibold text-[#171A35]">No complaint records found</h4>
        <p className="text-[11px] text-[#667085] max-w-sm mx-auto mt-0.5">
          Complaints classified in this session will appear in this audit log.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E7E5F2] shadow-[0_1px_3px_rgba(23,26,53,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#E7E5F2] bg-[#F8F9FC] text-[#475467] font-semibold">
              <th className="py-3.5 px-4 font-semibold text-[#252847]">Complaint Inquiry</th>
              <th className="py-3.5 px-3 font-semibold text-[#252847]">Category</th>
              <th className="py-3.5 px-3 font-semibold text-[#252847]">Department</th>
              <th className="py-3.5 px-3 font-semibold text-[#252847]">Model</th>
              <th className="py-3.5 px-3 font-semibold text-[#252847]">Confidence</th>
              <th className="py-3.5 px-3 font-semibold text-[#252847]">Timestamp</th>
              <th className="py-3.5 px-4 text-right font-semibold text-[#252847]">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EEF9] text-[#344054]">
            {currentRecords.map((item) => {
              const catInfo = getCategoryInfo(item.category);
              return (
                <tr key={item.id} className="hover:bg-[#F8F9FC]/70 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs font-medium text-[#171A35]">
                    <p className="line-clamp-2 leading-relaxed" title={item.text}>
                      "{item.text}"
                    </p>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-[12px] font-semibold text-[#171A35] bg-[#F8F9FC] border border-[#E7E5F2] px-2.5 py-0.5 rounded">
                      {catInfo?.name || item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-[#344054] font-medium">
                    {item.department}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-medium text-[13px] text-[#475467]">
                    {item.model === 'distilbert' ? 'DistilBERT' : 'LogReg'}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-[#171A35]">
                    {(item.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-[#475467] font-mono text-[13px]">
                    {item.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleCopyText(item.text, item.id)}
                      title="Copy complaint text"
                      className="p-1.5 rounded text-[#475467] hover:text-[#171A35] hover:bg-[#F8F9FC] transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 bg-[#F8F9FC]/70 border-t border-[#F0EEF9] flex items-center justify-between text-[13px] text-[#475467]">
        <div className="flex items-center gap-2">
          <span>
            Page <strong className="text-[#171A35] font-semibold">{currentPage}</strong> of{' '}
            <strong className="text-[#171A35] font-semibold">{totalPages}</strong>
          </span>
          <button
            onClick={onClearHistory}
            className="ml-4 text-[#475467] hover:text-rose-600 text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear audit log</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#E7E5F2] bg-white text-[#171A35] hover:bg-[#F8F9FC] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#E7E5F2] bg-white text-[#171A35] hover:bg-[#F8F9FC] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
