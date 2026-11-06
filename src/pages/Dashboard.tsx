import React from 'react';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { CategoryDistributionChart } from '../components/dashboard/CategoryDistributionChart';
import { ModelComparisonTable } from '../components/dashboard/ModelComparisonTable';
import { RecentComplaintsTable } from '../components/dashboard/RecentComplaintsTable';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Heading: 28-32px, 700 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A35]">
          Overview
        </h2>
        <p className="text-[15px] text-[#475467] mt-1">
          Monitor customer complaint classification metrics, model performance, and dispatch audit logs.
        </p>
      </div>

      {/* A & B. Welcome & KPI Summary Metrics */}
      <KpiGrid />

      {/* C. Complaint Category Distribution */}
      <CategoryDistributionChart />

      {/* D. Model Performance Benchmark Comparison */}
      <ModelComparisonTable />

      {/* E. Recent Complaints Audit Trail */}
      <RecentComplaintsTable />
    </div>
  );
};
