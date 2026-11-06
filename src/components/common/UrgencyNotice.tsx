import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from './Badge';

interface UrgencyNoticeProps {
  compact?: boolean;
}

export const UrgencyNotice: React.FC<UrgencyNoticeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FC] border border-[#E7E5F2] rounded-lg text-[13px] text-[#475467]">
        <Clock className="w-4 h-4 text-[#8B7CFF] shrink-0" />
        <span className="font-semibold text-[#171A35]">Urgency Classification:</span>
        <span className="text-[#475467]">Coming Soon (Dataset lacks urgency ground truth)</span>
        <Badge variant="neutral" size="sm" className="ml-auto">Pending Annotation</Badge>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E7E5F2] bg-white p-5 shadow-[0_1px_3px_rgba(23,26,53,0.04)]">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-[#F8F9FC] text-[#635BFF] shrink-0 mt-0.5 border border-[#E7E5F2]">
          <Clock className="w-4.5 h-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <h4 className="text-[15px] font-semibold text-[#171A35]">
              Urgency Classification — Coming Soon
            </h4>
            <Badge variant="neutral" size="sm">Roadmap Extension</Badge>
          </div>
          <p className="text-[14px] text-[#344054] leading-relaxed">
            The Bitext Customer Support training dataset contains 11 intent classes but <strong className="text-[#171A35]">no urgency or priority labels</strong>. In accordance with scientific integrity, urgency is not simulated using heuristics or assumptions. The API contract reserves <code className="font-mono text-[12px] bg-[#F8F9FC] px-1.5 py-0.5 rounded text-[#171A35] border border-[#E7E5F2]">urgency: null</code> to accommodate future multi-task classification.
          </p>
        </div>
      </div>
    </div>
  );
};
