import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '../common/Card';

interface ExplanationCardProps {
  explanation: string | null;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation }) => {
  // Only display explanation when the backend returns one
  if (!explanation) {
    return null;
  }

  return (
    <Card
      title="Prediction Attribution"
      subtitle="Feature importance and token attribution returned by the model backend."
    >
      <div className="p-4 rounded-xl bg-[#F8F9FC] border border-[#E7E5F2] text-[14px] text-[#344054] leading-relaxed flex items-start gap-3">
        <Info className="w-4.5 h-4.5 text-[#635BFF] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-[#171A35] mb-1">Attribution Drivers:</p>
          <p>{explanation}</p>
        </div>
      </div>
    </Card>
  );
};
