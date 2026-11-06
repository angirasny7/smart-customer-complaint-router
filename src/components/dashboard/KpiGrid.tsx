import React from 'react';
import { Clock, Cpu, FileText, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KpiGrid: React.FC = () => {
  const { complaintHistory, isDemoMode } = useApp();

  const totalProcessed = complaintHistory.length;
  const demoCount = complaintHistory.filter((c) => c.isDemoSample).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Complaints Processed */}
      <div className="bg-white rounded-xl border border-[#E7E5F2] p-5 shadow-[0_1px_3px_rgba(23,26,53,0.04)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#475467] mb-2">
          <span className="text-[14px] font-semibold text-[#252847]">Complaints Processed</span>
          <FileText className="w-4.5 h-4.5 text-[#635BFF]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#171A35]">
              {totalProcessed}
            </span>
            {isDemoMode && (
              <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {demoCount} demo
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#475467] mt-1">Session records in audit log</p>
        </div>
      </div>

      {/* KPI 2: Supported Categories */}
      <div className="bg-white rounded-xl border border-[#E7E5F2] p-5 shadow-[0_1px_3px_rgba(23,26,53,0.04)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#475467] mb-2">
          <span className="text-[14px] font-semibold text-[#252847]">Supported Categories</span>
          <Layers className="w-4.5 h-4.5 text-[#635BFF]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#171A35]">11</span>
            <span className="text-[14px] font-medium text-[#475467]">classes</span>
          </div>
          <p className="text-[13px] text-[#475467] mt-1">Bitext balanced intent ontology</p>
        </div>
      </div>

      {/* KPI 3: Available Models */}
      <div className="bg-white rounded-xl border border-[#E7E5F2] p-5 shadow-[0_1px_3px_rgba(23,26,53,0.04)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#475467] mb-2">
          <span className="text-[14px] font-semibold text-[#252847]">Available Models</span>
          <Cpu className="w-4.5 h-4.5 text-[#635BFF]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#171A35]">2</span>
            <span className="text-[11px] font-semibold text-[#635BFF] bg-[#EDE9FE] px-2 py-0.5 rounded border border-[#DDD6FE]">
              DistilBERT Primary
            </span>
          </div>
          <p className="text-[13px] text-[#475467] mt-1">DistilBERT (99.85%) & LogReg (99.74%)</p>
        </div>
      </div>

      {/* KPI 4: Urgency Classification */}
      <div className="bg-white rounded-xl border border-[#E7E5F2] p-5 shadow-[0_1px_3px_rgba(23,26,53,0.04)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#475467] mb-2">
          <span className="text-[14px] font-semibold text-[#252847]">Urgency Classification</span>
          <Clock className="w-4.5 h-4.5 text-[#8B7CFF]" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-bold text-[#171A35]">Coming Soon</span>
          </div>
          <p className="text-[13px] text-[#475467] mt-1">Dataset lacks urgency ground truth</p>
        </div>
      </div>
    </div>
  );
};
