import React from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, Menu } from 'lucide-react';
import { BackendStatusBadge } from '../common/BackendStatusBadge';
import { useApp } from '../../context/AppContext';
import { ENV } from '../../config/env';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const PAGE_HEADERS: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Overview',
    subtitle: 'Monitor customer complaint classification and model performance.',
  },
  '/classify': {
    title: 'Classify a Complaint',
    subtitle: 'Understand and route customer complaints using AI.',
  },
  '/history': {
    title: 'Complaint History',
    subtitle: 'Review logged predictions and operational dispatch records.',
  },
  '/models': {
    title: 'Model Information',
    subtitle: 'Experimental benchmarks and architectures from Google Colab testing.',
  },
  '/about': {
    title: 'About Project',
    subtitle: 'System objectives, Bitext dataset details, and architecture roadmap.',
  },
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { isDemoMode } = useApp();

  const currentMeta = PAGE_HEADERS[location.pathname] || {
    title: 'Smart Router',
    subtitle: 'AI-assisted routing for customer support tickets.',
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E7E5F2] sticky top-0 z-30 transition-colors">
      {/* Slim, Unobtrusive Demonstration Banner */}
      {isDemoMode && (
        <div className="bg-amber-50/80 border-b border-amber-200/50 px-6 py-1.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              <strong>Demo Mode:</strong> Displaying illustrative sample data. Connect the FastAPI backend at <code className="font-mono text-[10px] bg-amber-100/70 px-1 py-0.5 rounded">{ENV.API_BASE_URL}</code> to execute live inferences using exported Colab weights.
            </span>
          </div>
        </div>
      )}

      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 -ml-1 text-[#475467] hover:text-[#171A35] rounded-md transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[18px] font-bold text-[#171A35] tracking-tight leading-tight">
              {currentMeta.title}
            </h1>
            <p className="text-[13px] text-[#475467] hidden sm:block mt-0.5">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Compact Status Control */}
        <div className="flex items-center gap-2">
          <BackendStatusBadge />
        </div>
      </div>
    </header>
  );
};
