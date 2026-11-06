import React from 'react';
import { ModelDetailCard } from '../components/models/ModelDetailCard';
import { MetricsExplainer } from '../components/models/MetricsExplainer';
import { ModelComparisonTable } from '../components/dashboard/ModelComparisonTable';
import { MODEL_EVALUATION_METRICS } from '../config/metrics';

export const ModelInformation: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Heading: 28-32px, 700 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A35]">
          Model Information
        </h2>
        <p className="text-[15px] text-[#475467] mt-1">
          Detailed architecture specifications and evaluation benchmarks achieved during Google Colab training.
        </p>
      </div>

      {/* 1. Two Clean Model Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModelDetailCard model={MODEL_EVALUATION_METRICS.distilbert} />
        <ModelDetailCard model={MODEL_EVALUATION_METRICS.logistic_regression} />
      </div>

      {/* 2. Side-by-Side Benchmark Comparison Table */}
      <ModelComparisonTable />

      {/* 3. Metrics Definitions Reference */}
      <MetricsExplainer />
    </div>
  );
};
