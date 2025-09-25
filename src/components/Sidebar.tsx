import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Code2,
  FolderOpen,
  Tags,
  Brain,
  X,
  Home,
  ChevronRight
} from 'lucide-react';

export interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  { id: 'developers', label: 'Developers', icon: Users, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20' },
  { id: 'skill-areas', label: 'Skill Areas', icon: Tags, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  { id: 'project-categories', label: 'Categories', icon: Code2, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/20' },
  { id: 'ai-agent', label: 'AI Agent', icon: Brain, color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/20' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 68 : 220 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="flex flex-col h-full bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 border-r border-slate-700/50 z-20"
      aria-label="Sidebar"
    >
      {/* Header */}
      
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-2"
              >
                {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div> */}
                
                <div>
                  <h1 className="text-lg font-semibold text-white ">DevPortal</h1>
                  {/* <p className="text-[10px] text-slate-400">Team Management</p> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-md p-1.5 hover:bg-slate-700/40 transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-300" /> : <X className="w-4 h-4 text-slate-300" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {menuItems.map((it) => {
          const Icon = it.icon;
          const active = activeTab === it.id;

          return (
            <motion.button
              key={it.id}
              onClick={() => onTabChange(it.id)}
              initial={false}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-md transition-colors ${
                active
                  ? `${it.bgColor} ${it.borderColor} border shadow-sm text-white`
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <div className={`p-2.5 rounded-md ${active ? it.bgColor : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${active ? it.color : 'text-slate-400'}`} />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-300'}`}
                  >
                    {it.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      {/* <div className="px-2.5 py-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-purple-500 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-semibold">A</span>
          </div> */}

          {/* <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="flex-1"
              >
                <div className="text-xs font-semibold text-white">Admin User</div>
                <div className="text-[10px] text-slate-400">admin@devportal.com</div>
              </motion.div>
            )}
          </AnimatePresence> */}
        {/* </div> */}
      {/* </div> */}
    </motion.aside>
  );
};

export default Sidebar;
