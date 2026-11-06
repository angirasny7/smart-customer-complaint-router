import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F3FF] text-[#171A35] flex relative selection:bg-[#EDE9FE] selection:text-[#635BFF]">
      {/* Soft atmospheric radial gradient for visual depth */}
      <div 
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,91,255,0.06),transparent_70%)]" 
        aria-hidden="true" 
      />

      {/* Sidebar Navigation (244px, Navy #11152B) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[244px] relative z-10">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 px-6 py-7 md:px-10 md:py-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
