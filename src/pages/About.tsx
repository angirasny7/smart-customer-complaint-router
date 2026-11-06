import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '../config/categories';
import { CATEGORY_DEPARTMENT_MAPPING } from '../config/departments';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-[#171A35]">
      {/* 1. Clean Editorial Header */}
      <div className="space-y-3 pb-6 border-b border-[#E7E5F2]">
        <span className="text-[13px] font-semibold text-[#635BFF] uppercase tracking-wider">
          Academic Research Project
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-[#171A35]">
          Smart Customer Complaint Router
        </h2>
        <p className="text-[16px] text-[#344054] leading-relaxed max-w-2xl">
          An automated natural language routing system designed to classify incoming support inquiries into 11 predefined business intents and dispatch tickets to appropriate operational teams.
        </p>
      </div>

      {/* 2. Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="text-[20px] font-semibold text-[#252847] tracking-tight">
            Problem Statement
          </h3>
          <p className="text-[15px] text-[#344054] leading-relaxed">
            Customer support desks handle thousands of unstructured natural language inquiries daily. Manual triaging is labor-intensive, error-prone, and causes queue bottlenecks. This system investigates whether pre-trained NLP models can automate intent identification with high statistical confidence.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-[20px] font-semibold text-[#252847] tracking-tight">
            Project Objectives
          </h3>
          <ul className="text-[14px] text-[#344054] space-y-3">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#635BFF] mt-0.5 shrink-0" />
              <span>Multi-class text classification across 11 discrete intent domains.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#635BFF] mt-0.5 shrink-0" />
              <span>Comparative evaluation between linear TF-IDF and fine-tuned DistilBERT.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#635BFF] mt-0.5 shrink-0" />
              <span>Clean API contract ready for FastAPI backend integration.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Dataset Information */}
      <div className="space-y-4 pt-6 border-t border-[#E7E5F2]">
        <h3 className="text-[20px] font-semibold text-[#252847] tracking-tight">
          Dataset Information
        </h3>
        <p className="text-[15px] text-[#344054] leading-relaxed">
          The models were trained on the <strong>Bitext Customer Support LLM Chatbot Training Dataset</strong> (<code className="font-mono text-[13px] bg-[#F8F9FC] border border-[#E7E5F2] px-2 py-0.5 rounded text-[#171A35]">bitext/Bitext-customer-support-llm-chatbot-training-dataset</code>) containing 26,872 curated dialogues across 11 balanced intent categories (~2,443 samples each).
        </p>
        <p className="text-[13px] text-[#475467] italic">
          *Note: The dataset represents curated customer service training data rather than internal corporate complaint logs.
        </p>

        {/* Categories & Departments Grid */}
        <div className="pt-2">
          <span className="text-[14px] font-semibold text-[#252847] block mb-2.5">
            11 Supported Categories & Proposed Department Routing:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {COMPLAINT_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-xl bg-white border border-[#E7E5F2] shadow-[0_1px_2px_rgba(23,26,53,0.03)] text-xs"
              >
                <span className="text-[14px] font-semibold text-[#171A35] block">{cat.name}</span>
                <span className="text-[12px] text-[#475467] font-medium truncate block mt-0.5">
                  → {CATEGORY_DEPARTMENT_MAPPING[cat.id]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Machine Learning Methodology */}
      <div className="space-y-4 pt-6 border-t border-[#E7E5F2]">
        <h3 className="text-[20px] font-semibold text-[#252847] tracking-tight">
          Machine Learning Methodology
        </h3>
        <p className="text-[15px] text-[#344054] leading-relaxed">
          Offline experimentation was completed entirely in Google Colab on an identical train/validation/test split.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-white p-5 rounded-xl border border-[#E7E5F2] shadow-[0_1px_3px_rgba(23,26,53,0.04)] space-y-2">
            <span className="text-[16px] font-bold text-[#171A35] block">1. TF-IDF + Logistic Regression</span>
            <span className="text-[13px] font-medium text-[#475467] block">Baseline Model</span>
            <p className="text-[14px] text-[#344054] leading-relaxed">
              Extracts 5,202 unigram and bigram n-grams with sublinear term-frequency scaling. Trained in 5.65 seconds, achieving 99.74% test accuracy.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#635BFF]/35 shadow-[0_1px_3px_rgba(99,91,255,0.08)] space-y-2 ring-1 ring-[#635BFF]/10">
            <span className="text-[16px] font-bold text-[#171A35] block">2. Fine-Tuned DistilBERT</span>
            <span className="text-[13px] text-[#635BFF] block font-semibold">Selected Primary Model</span>
            <p className="text-[14px] text-[#344054] leading-relaxed">
              Fine-tuned <code className="bg-[#F8F9FC] border border-[#E7E5F2] px-1.5 py-0.5 rounded text-[#171A35] font-mono text-[13px]">distilbert-base-uncased</code> with 64-token sequence truncation. Achieved 99.85% test accuracy and 99.86% Macro F1 with only 4 misclassified samples.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Limitations & Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E7E5F2]">
        <div className="space-y-3">
          <h3 className="text-[20px] font-semibold text-[#252847] tracking-tight">
            Limitations
          </h3>
          <ul className="text-[14px] text-[#344054] space-y-2 leading-relaxed">
            <li>
              • <strong className="text-[#171A35]">No Urgency Ground-Truth:</strong> The dataset contains no priority labels. Urgency prediction is therefore not simulated.
            </li>
            <li>
              • <strong className="text-[#171A35]">Closed-World Assumption:</strong> Complaints outside the 11 categories will be mapped to the closest mathematical match.
            </li>
            <li>
              • <strong className="text-[#171A35]">Sequence Length:</strong> Input sequences beyond 64 tokens are truncated for inference efficiency.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-[20px] font-semibold text-[#252847] tracking-tight">
            Future Scope
          </h3>
          <ul className="text-[14px] text-[#344054] space-y-2 leading-relaxed">
            <li>
              • <strong className="text-[#171A35]">Urgency Classification:</strong> Train a multi-task head once an annotated urgency dataset is acquired.
            </li>
            <li>
              • <strong className="text-[#171A35]">Explainability Pipeline:</strong> Integrate LIME or Integrated Gradients on the FastAPI backend for token salience.
            </li>
            <li>
              • <strong className="text-[#171A35]">Confidence Fallback:</strong> Route low-confidence predictions to human tier-1 triage agents.
            </li>
          </ul>
        </div>
      </div>

      {/* 6. Clean Bottom Urgency Banner */}
      <div className="pt-2">
        <div className="p-4 bg-[#F8F9FC] border border-[#E7E5F2] rounded-xl text-[13px] text-[#344054] flex items-start gap-3">
          <Clock className="w-4.5 h-4.5 text-[#8B7CFF] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#171A35]">Urgency Notice:</strong> Urgency classification is planned for future releases. The existing API contract retains <code className="font-mono bg-white border border-[#E7E5F2] px-2 py-0.5 rounded text-[#171A35] font-semibold">urgency: null</code> to seamlessly support multi-task heads without breaking client integrations.
          </p>
        </div>
      </div>
    </div>
  );
};
