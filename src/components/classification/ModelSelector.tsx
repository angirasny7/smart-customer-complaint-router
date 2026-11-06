import React from 'react';
import { BrainCircuit, Cpu } from 'lucide-react';
import type { ModelId } from '../../types/complaint';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-semibold text-[#171A35]">
          Inference Model
        </label>
        <span className="text-[13px] text-[#475467] font-medium">
          Pre-trained Colab weights
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option 1: DistilBERT (Recommended) */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectModel('distilbert')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
            selectedModel === 'distilbert'
              ? 'border-[#635BFF] bg-[#EDE9FE]/25 text-[#171A35] ring-1 ring-[#635BFF]'
              : 'border-[#E7E5F2] bg-white hover:border-[#8B7CFF]/60 text-[#171A35]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg mt-0.5 ${
                selectedModel === 'distilbert'
                  ? 'bg-[#635BFF] text-white shadow-2xs'
                  : 'bg-[#F8F9FC] text-[#475467] border border-[#E7E5F2]'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#171A35]">DistilBERT</span>
                <span className="text-[11px] font-semibold text-[#635BFF] bg-[#EDE9FE] px-2 py-0.5 rounded border border-[#DDD6FE]">
                  Recommended
                </span>
              </div>
              <p className="text-[13px] text-[#475467] mt-0.5 leading-snug">
                Transformer · 99.85% test accuracy · 99.86% Macro F1
              </p>
            </div>
          </div>
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
              selectedModel === 'distilbert'
                ? 'border-[#635BFF] bg-[#635BFF]'
                : 'border-[#D0CDE3]'
            }`}
          >
            {selectedModel === 'distilbert' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </span>
        </button>

        {/* Option 2: Logistic Regression */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectModel('logistic_regression')}
          className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
            selectedModel === 'logistic_regression'
              ? 'border-[#635BFF] bg-[#EDE9FE]/25 text-[#171A35] ring-1 ring-[#635BFF]'
              : 'border-[#E7E5F2] bg-white hover:border-[#8B7CFF]/60 text-[#171A35]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg mt-0.5 ${
                selectedModel === 'logistic_regression'
                  ? 'bg-[#635BFF] text-white shadow-2xs'
                  : 'bg-[#F8F9FC] text-[#475467] border border-[#E7E5F2]'
              }`}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#171A35]">Logistic Regression</span>
                <span className="text-[11px] font-medium text-[#475467] bg-[#F8F9FC] px-2 py-0.5 rounded border border-[#E7E5F2]">
                  Baseline
                </span>
              </div>
              <p className="text-[13px] text-[#475467] mt-0.5 leading-snug">
                TF-IDF (5,202 features) · 99.74% accuracy · &lt;5ms latency
              </p>
            </div>
          </div>
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
              selectedModel === 'logistic_regression'
                ? 'border-[#635BFF] bg-[#635BFF]'
                : 'border-[#D0CDE3]'
            }`}
          >
            {selectedModel === 'logistic_regression' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
