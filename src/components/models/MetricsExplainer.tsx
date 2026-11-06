import React from 'react';
import { Card } from '../common/Card';
import { METRIC_DEFINITIONS } from '../../config/metrics';

export const MetricsExplainer: React.FC = () => {
  return (
    <Card
      title="Evaluation Benchmark Definitions"
      subtitle="Standard machine-learning evaluation metrics computed during Google Colab experimentation."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {METRIC_DEFINITIONS.map((metric, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-[#E7E5F2] bg-[#F8F9FC] text-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[15px] font-semibold text-[#171A35]">{metric.title}</span>
              <span className="font-mono text-[11px] font-medium text-[#475467] bg-white px-2 py-0.5 rounded border border-[#E7E5F2]">
                Formula
              </span>
            </div>
            <code className="text-[13px] font-mono text-[#635BFF] font-semibold block mb-1.5">
              {metric.formula}
            </code>
            <p className="text-[13px] text-[#344054] leading-relaxed">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-[#475467] mt-3 pt-3 border-t border-[#F0EEF9]">
        *Important Note: These metrics represent global test-set evaluation results computed offline in Colab. They are separate from individual inference confidence scores.
      </p>
    </Card>
  );
};
