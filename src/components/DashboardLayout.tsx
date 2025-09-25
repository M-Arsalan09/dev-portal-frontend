import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Command } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative text-slate-200">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.04),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.03),transparent_30%)]" />
      <div className="flex h-screen relative">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((s) => !s)}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center justify-between h-14 px-4 bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative w-56">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-7 pr-2 py-1.5 bg-slate-700/40 border border-slate-700 rounded-md text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                />
              </div>

              <button
                aria-label="Notifications"
                className="relative p-2 rounded-md bg-slate-700/40 hover:bg-slate-600/40 transition"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>

              <button
                aria-label="Command palette"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-700/40 hover:bg-slate-600/40 transition text-xs"
              >
                <Command className="w-3.5 h-3.5" />
                <span className="text-[10px] text-slate-300 font-semibold">⌘K</span>
              </button>
            </div>
          </header>

          {/* Page content area */}
          <section className="flex-1 overflow-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="min-h-[300px]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f1724',
            color: '#fff',
            borderRadius: 10,
            padding: 14,
            fontSize: 14,
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;
