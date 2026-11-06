import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { COMPLAINT_CATEGORIES } from '../../config/categories';
import { DATASET_DISTRIBUTION_DATA } from '../../services/demoData';
import { useApp } from '../../context/AppContext';
import { BarChart2 } from 'lucide-react';

export const CategoryDistributionChart: React.FC = () => {
  const { complaintHistory, isDemoMode } = useApp();
  const [viewMode, setViewMode] = useState<'dataset' | 'session'>('dataset');

  // Compute session complaints distribution
  const sessionData = COMPLAINT_CATEGORIES.map((cat) => {
    const count = complaintHistory.filter(
      (c) => c.category.toUpperCase() === cat.id
    ).length;
    return {
      category: cat.id,
      count: count,
      name: cat.name,
    };
  });

  const datasetData = DATASET_DISTRIBUTION_DATA.map((item) => {
    const info = COMPLAINT_CATEGORIES.find((c) => c.id === item.category);
    return {
      category: item.category,
      count: item.count,
      name: info?.name || item.category,
    };
  });

  const currentChartData = viewMode === 'dataset' ? datasetData : sessionData;
  const isSessionEmpty = viewMode === 'session' && complaintHistory.length === 0;

  return (
    <Card
      title="Complaint Category Distribution"
      subtitle={
        viewMode === 'dataset'
          ? 'Bitext training dataset baseline across 11 balanced classes (~2,443 each).'
          : 'Distribution of complaints processed during this session.'
      }
      action={
        <div className="flex items-center bg-[#F8F9FC] p-1 rounded-lg border border-[#E7E5F2] text-xs">
          <button
            onClick={() => setViewMode('dataset')}
            className={`px-3 py-1.5 rounded-md text-[13px] transition-colors cursor-pointer ${
              viewMode === 'dataset'
                ? 'bg-white text-[#171A35] shadow-2xs font-semibold'
                : 'text-[#475467] hover:text-[#171A35] font-medium'
            }`}
          >
            Dataset (26.8k)
          </button>
          <button
            onClick={() => setViewMode('session')}
            className={`px-3 py-1.5 rounded-md text-[13px] transition-colors cursor-pointer ${
              viewMode === 'session'
                ? 'bg-white text-[#171A35] shadow-2xs font-semibold'
                : 'text-[#475467] hover:text-[#171A35] font-medium'
            }`}
          >
            Session ({complaintHistory.length})
          </button>
        </div>
      }
    >
      {viewMode === 'session' && isDemoMode && (
        <div className="mb-3 text-[13px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2 flex items-center justify-between">
          <span className="font-medium">Demonstration session records for UI testing.</span>
          <Badge variant="warning" size="sm">Demo Records</Badge>
        </div>
      )}

      {isSessionEmpty ? (
        <div className="h-52 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E7E5F2] rounded-lg bg-[#F8F9FC]/40">
          <BarChart2 className="w-8 h-8 text-[#8B7CFF] mb-2" />
          <p className="text-[15px] font-semibold text-[#171A35]">No session complaints recorded yet</p>
          <p className="text-[13px] text-[#475467] mt-1">
            Submit a complaint on the Classify page to view session activity.
          </p>
        </div>
      ) : (
        <div className="h-60 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentChartData}
              margin={{ top: 5, right: 10, left: -15, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEF9" />
              <XAxis
                dataKey="category"
                angle={-30}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: '#344054', fontWeight: 500 }}
                height={45}
                axisLine={{ stroke: '#E7E5F2' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#344054', fontWeight: 500 }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#11152B] text-white px-3.5 py-2.5 rounded-lg text-xs shadow-md border border-[#212952]">
                        <p className="font-semibold text-[13px] text-[#8B7CFF]">{data.category}</p>
                        <p className="text-slate-200 text-[12px] mt-0.5">
                          Count: <strong className="text-white">{data.count.toLocaleString()}</strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#635BFF" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
