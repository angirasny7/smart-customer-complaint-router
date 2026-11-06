import React, { useMemo, useState } from 'react';
import { AlertCircle, Database, KeyRound, Lock, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryTable } from '../components/history/HistoryTable';
import { Button } from '../components/common/Button';

export const ComplaintHistory: React.FC = () => {
  const {
    isDemoMode,
    complaintHistory,
    clearComplaintHistory,
    adminKey,
    setAdminKey,
    isLiveLoading,
    liveDbError,
    fetchLiveHistory,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedModel, setSelectedModel] = useState('ALL');
  const [inputAdminKey, setInputAdminKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    return complaintHistory.filter((item) => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category.toUpperCase() !== selectedCategory) {
        return false;
      }
      // Model filter
      if (selectedModel !== 'ALL' && item.model !== selectedModel) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = item.text.toLowerCase().includes(query);
        const deptMatch = item.department.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        return textMatch || deptMatch || catMatch;
      }
      return true;
    });
  }, [complaintHistory, searchQuery, selectedCategory, selectedModel]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedModel('ALL');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAdminKey.trim()) {
      setAuthError('Please enter an Administrator API key.');
      return;
    }
    setAuthError(null);
    const success = await fetchLiveHistory(inputAdminKey.trim());
    if (success) {
      setAdminKey(inputAdminKey.trim());
    }
  };

  const handleAdminLogout = () => {
    setAdminKey(null);
    setInputAdminKey('');
  };

  const handleRefreshLive = async () => {
    if (adminKey) {
      await fetchLiveHistory(adminKey);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171A35]">
            Complaint History
          </h2>
          <p className="text-[15px] text-[#475467] mt-1">
            Review logged predictions, confidence scores, and department routing audit records.
          </p>
        </div>

        {/* Status Mode Pill */}
        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Mode Audit Trail</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Database className="w-3.5 h-3.5" />
              <span>Neon PostgreSQL Live DB</span>
            </span>
          )}
        </div>
      </div>

      {/* Mode Notification Banner */}
      {isDemoMode ? (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Demo Mode Active:</span>
            <span className="ml-1 text-amber-800">
              Displaying illustrative sample records. To inspect persistent database records from Neon PostgreSQL, switch to <strong>Live Mode</strong> in the top header.
            </span>
          </div>
        </div>
      ) : (
        /* Live Mode Admin Status & Authentication */
        <div>
          {!adminKey ? (
            /* Admin Auth Prompt for Live Mode */
            <div className="bg-white rounded-xl border border-[#E7E5F2] p-6 shadow-[0_1px_3px_rgba(23,26,53,0.04)] space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-[#EDE9FE] text-[#635BFF] border border-[#DDD6FE] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#171A35]">
                    Administrator Authentication Required
                  </h3>
                  <p className="text-[14px] text-[#475467] mt-1 leading-relaxed max-w-2xl">
                    To protect customer inquiry privacy, global complaint history is restricted to authorized administrators. Enter the administrator key configured on your FastAPI backend to inspect persistent records.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="flex flex-col sm:flex-row gap-2.5 max-w-lg pt-1">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-[#475467] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter Admin API Key (ADMIN_API_KEY)"
                    value={inputAdminKey}
                    onChange={(e) => setInputAdminKey(e.target.value)}
                    disabled={isLiveLoading}
                    className="w-full pl-9 pr-3 py-2 text-sm text-[#171A35] bg-[#F8F9FC] border border-[#E7E5F2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>
                <Button type="submit" isLoading={isLiveLoading} disabled={isLiveLoading}>
                  Authenticate & View
                </Button>
              </form>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[13px] text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {liveDbError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[13px] text-rose-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{liveDbError}</span>
                </div>
              )}
            </div>
          ) : (
            /* Admin Session Active Header */
            <div className="bg-white rounded-xl border border-[#E7E5F2] px-4 py-3 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-[#171A35]">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-[13px]">Neon PostgreSQL Session Active</span>
                <span className="text-[#475467] text-[12px]">(Authenticated Administrator)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshLive}
                  disabled={isLiveLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8F9FC] hover:bg-[#F0EEF9] text-[#171A35] border border-[#E7E5F2] text-[12px] font-medium transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLiveLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh DB</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-2.5 py-1 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 text-[12px] font-medium transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {liveDbError && adminKey && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[13px] text-rose-800 flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{liveDbError}</span>
            </div>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <HistoryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onReset={handleResetFilters}
        totalFiltered={filteredRecords.length}
      />

      {/* Main Records Table */}
      <HistoryTable
        records={filteredRecords}
        onClearHistory={clearComplaintHistory}
      />

      {/* Storage and Data Privacy Footnote */}
      <p className="text-[13px] text-[#475467] text-center">
        {isDemoMode
          ? 'Demo audit records are local illustrative samples for interface exploration.'
          : 'Live predictions are committed to Neon PostgreSQL. Inquiries older than 90 days are purged per the data retention policy.'}
      </p>
    </div>
  );
};
