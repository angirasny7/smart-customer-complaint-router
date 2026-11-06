import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ModelMetrics } from '../../types/complaint';

interface ModelDetailCardProps {
  model: ModelMetrics;
}

export const ModelDetailCard: React.FC<ModelDetailCardProps> = ({ model }) => {
  const isDistilBERT = model.id === 'distilbert';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-[0_1px_3px_rgba(23,26,53,0.04)] transition-all ${
        isDistilBERT ? 'border-[#635BFF]/35 ring-1 ring-[#635BFF]/10' : 'border-[#E7E5F2]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EEF9]">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-[20px] font-bold text-[#171A35] tracking-tight">{model.name}</h3>
            {model.isRecommended && (
              <span className="text-[11px] font-semibold text-[#635BFF] bg-[#EDE9FE] border border-[#DDD6FE] px-2 py-0.5 rounded">
                Recommended
              </span>
            )}
          </div>
          <p className="text-[14px] text-[#475467] mt-0.5">{model.type}</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 py-4 border-b border-[#F0EEF9] text-center">
        <div>
          <span className="text-[12px] font-semibold text-[#475467] uppercase tracking-wide block">
            Macro F1
          </span>
          <span className="text-[28px] font-bold text-[#635BFF] mt-0.5 block leading-tight">
            {model.macroF1.toFixed(2)}%
          </span>
        </div>

        <div>
          <span className="text-[12px] font-semibold text-[#475467] uppercase tracking-wide block">
            Test Accuracy
          </span>
          <span className="text-[28px] font-bold text-[#171A35] mt-0.5 block leading-tight">
            {model.accuracy.toFixed(2)}%
          </span>
        </div>

        <div>
          <span className="text-[12px] font-semibold text-[#475467] uppercase tracking-wide block">
            Train Duration
          </span>
          <span className="text-[28px] font-bold text-[#171A35] mt-0.5 block leading-tight">
            {model.trainingTimeSec}s
          </span>
        </div>
      </div>

      {/* Primary Key Specs */}
      <div className="py-3.5 text-[14px] text-[#171A35] space-y-1.5">
        {isDistilBERT ? (
          <>
            <div className="flex justify-between py-1">
              <span className="text-[#475467]">Base Checkpoint:</span>
              <code className="font-mono text-[13px] font-semibold text-[#171A35] bg-[#F8F9FC] px-2 py-0.5 rounded border border-[#E7E5F2]">
                distilbert-base-uncased
              </code>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#475467]">Max Sequence:</span>
              <span className="font-semibold text-[#171A35]">64 tokens</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between py-1">
              <span className="text-[#475467]">TF-IDF Vocabulary:</span>
              <span className="font-semibold text-[#171A35]">5,202 features</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#475467]">N-gram Range:</span>
              <span className="font-semibold text-[#171A35]">(1, 2) Unigrams & Bigrams</span>
            </div>
          </>
        )}
      </div>

      {/* Expandable Technical Details */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-[14px] font-semibold text-[#635BFF] hover:text-[#5247EE] py-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Architecture Details' : 'View Architecture & Preprocessing'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#F8F9FC] text-[13px] text-[#344054] space-y-2 leading-relaxed border border-[#E7E5F2] animate-fadeIn">
            {isDistilBERT ? (
              <>
                <p>• 6 transformer layers, 768 hidden dimensions, 12 attention heads.</p>
                <p>• Fine-tuned using Hugging Face Trainer with Cross-Entropy Loss over 11 output classes.</p>
                <p>• Best validation checkpoint selected based on Macro F1 score to balance minority category performance.</p>
                <p>• 4 test samples misclassified on the held-out test split.</p>
              </>
            ) : (
              <>
                <p>• Sublinear TF-IDF term frequency scaling (1 + log(tf)).</p>
                <p>• L2 regularization penalty with L-BFGS solver for rapid convergence.</p>
                <p>• 7 test samples misclassified on the held-out test split.</p>
                <p>• Ultra-low inference latency with negligible memory footprint.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
