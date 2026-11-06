import React, { useState } from 'react';
import { AlertCircle, Eraser, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { ModelSelector } from './ModelSelector';
import type { ModelId } from '../../types/complaint';
import { DEMO_PRESET_COMPLAINTS } from '../../services/demoData';

interface ComplaintFormProps {
  onSubmit: (text: string, model: ModelId) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const [complaintText, setComplaintText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelId>('distilbert');
  const [validationError, setValidationError] = useState<string | null>(null);

  const charCount = complaintText.length;
  const maxChars = 2000;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComplaintText(e.target.value);
    if (validationError && e.target.value.trim().length > 0) {
      setValidationError(null);
    }
  };

  const handleClear = () => {
    setComplaintText('');
    setValidationError(null);
  };

  const handleSelectExample = (text: string) => {
    setComplaintText(text);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = complaintText.trim();
    if (!trimmed) {
      setValidationError('Please enter a customer complaint before classifying.');
      return;
    }
    if (trimmed.length < 5) {
      setValidationError('Complaint message is too short (min 5 characters).');
      return;
    }
    setValidationError(null);
    await onSubmit(trimmed, selectedModel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1. Model Selector */}
      <ModelSelector
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        disabled={isLoading}
      />

      {/* 2. Textarea Focus Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="complaint-input"
            className="text-[14px] font-semibold text-[#171A35]"
          >
            Customer Complaint Message
          </label>
          <span className="text-[#475467] text-[13px] font-medium">
            {charCount} / {maxChars}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="complaint-input"
            rows={4}
            value={complaintText}
            onChange={handleTextChange}
            disabled={isLoading}
            maxLength={maxChars}
            placeholder="Describe your issue in detail (e.g. delivery delays, billing errors, subscription changes)..."
            className={`w-full px-4 py-3 text-base text-[#171A35] placeholder:text-[#475467]/70 bg-white border rounded-xl shadow-[0_1px_2px_rgba(23,26,53,0.03)] focus:outline-hidden transition-all resize-y leading-relaxed ${
              validationError
                ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                : 'border-[#E7E5F2] focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]'
            } ${isLoading ? 'bg-[#F8F9FC] opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>

        {validationError && (
          <div className="flex items-center gap-1.5 text-[13px] text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-[13px] text-rose-900 flex items-start gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Classification failed:</span>
              <p className="mt-0.5 text-rose-800 text-[12px]">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Example Complaint Chips */}
      <div className="space-y-2">
        <span className="text-[13px] text-[#252847] font-semibold">
          Quick test examples:
        </span>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESET_COMPLAINTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectExample(sample.text)}
              className="text-[13px] text-[#344054] font-medium bg-[#F8F9FC] hover:bg-[#EDE9FE] hover:text-[#635BFF] hover:border-[#DDD6FE] border border-[#E7E5F2] px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left disabled:opacity-50"
            >
              "{sample.text}"
            </button>
          ))}
        </div>
      </div>

      {/* 4. Action Row */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!complaintText || isLoading}
          onClick={handleClear}
          icon={<Eraser className="w-4 h-4" />}
        >
          Clear
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          icon={<Sparkles className="w-4 h-4" />}
        >
          {isLoading ? 'Analyzing complaint...' : 'Classify Complaint'}
        </Button>
      </div>
    </form>
  );
};
