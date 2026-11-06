import React, { useState } from 'react';
import { ChevronDown, RefreshCw, Server, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ENV } from '../../config/env';

export const BackendStatusBadge: React.FC = () => {
  const { isDemoMode, setIsDemoMode, backendStatus, refreshBackendStatus } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBackendStatus();
    setIsRefreshing(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 text-xs">
        {/* Compact Mode Pill (Clickable) */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          title={isDemoMode ? 'Click to toggle Live API' : 'Click to toggle Demo Mode'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border ${
            isDemoMode
              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isDemoMode ? 'Demo' : 'Live'}</span>
        </button>

        {/* Compact Backend Status Dropdown Trigger */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#344054] bg-white hover:bg-[#F8F9FC] border border-[#E7E5F2] shadow-2xs transition-colors cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus === 'online'
                ? 'bg-emerald-500'
                : backendStatus === 'checking'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-slate-400'
            }`}
          />
          <span className="capitalize">{backendStatus === 'online' ? 'API Online' : backendStatus === 'checking' ? 'Connecting' : 'API Offline'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
        </button>
      </div>

      {/* Compact Popover */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-[#E7E5F2] shadow-[0_4px_12px_rgba(23,26,53,0.08)] z-50 p-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5F2]">
              <div className="flex items-center gap-2 text-[#171A35] font-semibold text-[14px]">
                <Server className="w-4 h-4 text-[#635BFF]" />
                <span>FastAPI Service</span>
              </div>
              <span
                className={`text-[12px] font-semibold px-2 py-0.5 rounded capitalize ${
                  backendStatus === 'online'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-[#F8F9FC] text-[#344054] border border-[#E7E5F2]'
                }`}
              >
                {backendStatus}
              </span>
            </div>

            <div className="py-3 space-y-2 text-[#475467] text-[13px]">
              <div className="flex justify-between items-center">
                <span>Endpoint:</span>
                <span className="font-mono text-[#171A35] text-[12px] bg-[#F8F9FC] px-1.5 py-0.5 rounded border border-[#E7E5F2]">{ENV.API_BASE_URL}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Routing:</span>
                <span className={isDemoMode ? 'text-amber-800 font-semibold text-[13px]' : 'text-emerald-800 font-semibold text-[13px]'}>
                  {isDemoMode ? 'Illustrative Sample Mode' : 'Live Colab Weights'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E5F2] flex items-center justify-between">
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className="text-[13px] font-semibold text-[#635BFF] hover:text-[#5247EE] cursor-pointer"
              >
                Switch to {isDemoMode ? 'Live API' : 'Demo Mode'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F9FC] hover:bg-[#F0EEF9] text-[#171A35] border border-[#E7E5F2] text-[12px] font-medium cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Check</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
