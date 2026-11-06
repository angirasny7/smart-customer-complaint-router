import React from 'react';
import { AlertCircle, Building2, CheckCircle2, Clock } from 'lucide-react';
import type { PredictResponse } from '../../types/complaint';
import { getCategoryInfo } from '../../config/categories';
import { DEPARTMENT_DESCRIPTIONS } from '../../config/departments';

interface ResultCardProps {
  result: PredictResponse;
  isDemoResult?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, isDemoResult = false }) => {
  const catInfo = getCategoryInfo(result.predicted_category);
  const deptDescription =
    DEPARTMENT_DESCRIPTIONS[result.suggested_department] ||
    'Dedicated support department handling routed customer tickets.';

  const confidencePercent = (result.confidence * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl border border-[#E7E5F2] shadow-[0_1px_3px_rgba(23,26,53,0.04)] overflow-hidden">
      {/* Demo Result Notice */}
      {isDemoResult && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-[13px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demonstration Sample:</strong> Output generated from an illustrative test sample for interface evaluation.
          </span>
        </div>
      )}

      {/* Main Decision Header */}
      <div className="p-6 border-b border-[#F0EEF9]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5">
          <div>
            <span className="text-[13px] font-semibold text-[#475467] uppercase tracking-wider block mb-1">
              Predicted Category & Routing
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A35]">
                {catInfo?.name || result.predicted_category}
              </span>
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#EDE9FE] text-[#635BFF] border border-[#DDD6FE] font-mono">
                {result.predicted_category}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0EEF9]">
            <span className="text-[13px] text-[#475467] font-semibold">Confidence Score</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-[#171A35]">{confidencePercent}%</span>
              <span className="text-[13px] text-[#475467] font-mono">({result.confidence.toFixed(3)})</span>
            </div>
          </div>
        </div>

        {/* Suggested Department Bar */}
        <div className="flex items-start sm:items-center gap-3.5 p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E7E5F2]">
          <div className="p-2 rounded-lg bg-white text-[#635BFF] border border-[#E7E5F2] shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#171A35]">
                Routed to: {result.suggested_department}
              </span>
              <span className="text-[12px] text-[#475467] font-medium">
                (Operational Support Unit)
              </span>
            </div>
            <p className="text-[13px] text-[#344054] truncate mt-0.5">
              {deptDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Decision Metadata Grid */}
      <div className="px-6 py-4 bg-[#F8F9FC]/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t border-[#F0EEF9]">
        <div>
          <span className="text-[#475467] text-[12px] font-medium block">Selected Model</span>
          <span className="font-semibold text-[#171A35] text-[14px]">
            {result.model_used === 'distilbert' ? 'DistilBERT Transformer' : 'TF-IDF Logistic Regression'}
          </span>
        </div>

        <div>
          <span className="text-[#475467] text-[12px] font-medium block">Urgency Status</span>
          <span className="font-semibold text-[#475467] text-[14px] flex items-center gap-1.5 mt-0.5">
            <Clock className="w-4 h-4 text-[#8B7CFF]" />
            Not Available (Coming Soon)
          </span>
        </div>

        <div>
          <span className="text-[#475467] text-[12px] font-medium block">Routing Pipeline</span>
          <span className="font-semibold text-emerald-800 text-[14px] flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Ticket Dispatched
          </span>
        </div>
      </div>
    </div>
  );
};
