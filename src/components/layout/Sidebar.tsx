import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Cpu,
  FileQuestion,
  History,
  MessageSquareText,
  Route,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/',
    icon: BarChart3,
  },
  {
    name: 'Classify Complaint',
    path: '/classify',
    icon: MessageSquareText,
  },
  {
    name: 'Complaint History',
    path: '/history',
    icon: History,
  },
  {
    name: 'Model Information',
    path: '/models',
    icon: Cpu,
  },
  {
    name: 'About Project',
    path: '/about',
    icon: FileQuestion,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: 244px width, Navy #11152B */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[244px] bg-[#11152B] text-slate-300 flex flex-col border-r border-[#1D2342] transition-transform duration-250 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-[#1D2342]/80">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center text-white shadow-xs group-hover:bg-[#5247EE] transition-colors">
              <Route className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-white tracking-tight">Smart Router</span>
              <span className="text-[11px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-[#1D2342] text-[#8B7CFF] border border-[#2D3560]/60">
                v1.0
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-all ${
                    isActive
                      ? 'bg-[#1C2244] text-white font-semibold shadow-2xs'
                      : 'text-[#9AA4C2] hover:text-white hover:bg-[#181D39] font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive ? 'text-[#8B7CFF]' : 'text-[#7B87A6]'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B7CFF] ml-auto" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Subtle Bottom Model Status */}
        <div className="p-3.5 mx-3 mb-3 rounded-lg bg-[#161B37] border border-[#212952] text-xs">
          <div className="flex items-center gap-2 text-slate-100 font-semibold mb-0.5 text-[13px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>DistilBERT (Primary)</span>
          </div>
          <p className="text-[#A0AEC0] text-[12px] leading-relaxed">
            99.85% test Macro F1 · Colab weights
          </p>
        </div>
      </aside>
    </>
  );
};
