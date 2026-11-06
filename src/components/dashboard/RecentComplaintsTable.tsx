import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquareText } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { getCategoryInfo } from '../../config/categories';

export const RecentComplaintsTable: React.FC = () => {
  const { complaintHistory } = useApp();

  const recentItems = complaintHistory.slice(0, 5);

  return (
    <Card
      title="Recent Complaints"
      subtitle="Latest customer submissions processed by the routing pipeline."
      action={
        complaintHistory.length > 0 && (
          <Link
            to="/history"
            className="text-[14px] font-semibold text-[#635BFF] hover:text-[#5247EE] flex items-center gap-1"
          >
            <span>View all ({complaintHistory.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )
      }
    >
      {recentItems.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <MessageSquareText className="w-8 h-8 text-[#8B7CFF] mb-2" />
          <h4 className="text-[15px] font-semibold text-[#171A35]">No complaints processed yet</h4>
          <p className="text-[14px] text-[#475467] max-w-sm mt-1 mb-3">
            Submit a query to test category routing.
          </p>
          <Link to="/classify">
            <Button size="sm">
              Classify Complaint
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#E7E5F2] text-[#475467] font-semibold">
                <th className="pb-3 font-semibold text-[#252847]">Complaint</th>
                <th className="pb-3 font-semibold text-[#252847]">Category</th>
                <th className="pb-3 font-semibold text-[#252847]">Model</th>
                <th className="pb-3 font-semibold text-[#252847]">Confidence</th>
                <th className="pb-3 font-semibold text-[#252847]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF9] text-[#344054]">
              {recentItems.map((item) => {
                const catInfo = getCategoryInfo(item.category);
                return (
                  <tr key={item.id} className="hover:bg-[#F8F9FC]/80 transition-colors">
                    <td className="py-3 max-w-xs font-medium text-[#171A35]">
                      <p className="truncate" title={item.text}>
                        "{item.text}"
                      </p>
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <span className="inline-flex items-center text-[12px] font-semibold text-[#171A35] bg-[#F8F9FC] border border-[#E7E5F2] px-2.5 py-0.5 rounded">
                        {catInfo?.name || item.category}
                      </span>
                    </td>
                    <td className="py-3 whitespace-nowrap text-[#344054] font-medium text-[13px]">
                      {item.model === 'distilbert' ? 'DistilBERT' : 'LogReg'}
                    </td>
                    <td className="py-3 whitespace-nowrap font-semibold text-[#171A35]">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 whitespace-nowrap text-[#475467] font-mono text-[13px]">
                      {item.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
