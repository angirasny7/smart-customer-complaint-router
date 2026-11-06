import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../common/Card';
import { MODEL_EVALUATION_METRICS } from '../../config/metrics';
import { Link } from 'react-router-dom';

export const ModelComparisonTable: React.FC = () => {
  const distilbert = MODEL_EVALUATION_METRICS.distilbert;
  const logreg = MODEL_EVALUATION_METRICS.logistic_regression;

  return (
    <Card
      title="Model Performance Benchmarks"
      subtitle="Colab test-set evaluation results across both pre-trained architectures."
      action={
        <Link
          to="/models"
          className="text-[14px] font-semibold text-[#635BFF] hover:text-[#5247EE] flex items-center gap-1"
        >
          <span>Architecture Specs</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#E7E5F2] text-[#475467] font-semibold">
              <th className="pb-3 font-semibold text-[#252847]">Metric</th>
              <th className="pb-3 font-bold text-[#171A35]">
                DistilBERT
                <span className="ml-2 text-[11px] font-semibold text-[#635BFF] bg-[#EDE9FE] px-2 py-0.5 rounded border border-[#DDD6FE]">
                  Primary
                </span>
              </th>
              <th className="pb-3 font-semibold text-[#344054]">
                TF-IDF + Logistic Reg
                <span className="ml-2 text-[11px] font-medium text-[#475467] bg-[#F8F9FC] px-2 py-0.5 rounded border border-[#E7E5F2]">
                  Baseline
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EEF9] text-[#344054]">
            <tr>
              <td className="py-3 font-semibold text-[#171A35]">Macro F1 (Primary)</td>
              <td className="py-3 font-bold text-[#635BFF] text-[16px]">{distilbert.macroF1.toFixed(2)}%</td>
              <td className="py-3 font-semibold text-[#171A35] text-[16px]">{logreg.macroF1.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-[#171A35]">Test Accuracy</td>
              <td className="py-3 font-semibold text-[#171A35]">{distilbert.accuracy.toFixed(2)}%</td>
              <td className="py-3 font-medium text-[#344054]">{logreg.accuracy.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-[#171A35]">Macro Precision / Recall</td>
              <td className="py-3 text-[#171A35] font-medium">
                {distilbert.macroPrecision.toFixed(2)}% / {distilbert.macroRecall.toFixed(2)}%
              </td>
              <td className="py-3 text-[#344054]">
                {logreg.macroPrecision.toFixed(2)}% / {logreg.macroRecall.toFixed(2)}%
              </td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-[#171A35]">Misclassifications</td>
              <td className="py-3 text-[#171A35] font-medium">4 / test split</td>
              <td className="py-3 text-[#344054]">7 / test split</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-[#171A35]">Colab Training Duration</td>
              <td className="py-3 text-[#171A35] font-medium">193.30s</td>
              <td className="py-3 text-[#344054]">5.65s</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-[#475467] mt-3 pt-3 border-t border-[#F0EEF9]">
        *Evaluation metrics computed on held-out test split in Google Colab. Not individual prediction confidence.
      </p>
    </Card>
  );
};
