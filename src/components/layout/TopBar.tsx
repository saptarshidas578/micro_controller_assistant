import React, { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { Bell, LogOut, Sun, Moon, Sparkles } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Standard Tailwind dark mode toggling class in HTML node
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 relative z-30 transition-colors duration-300">
      
      {/* Search Bar / Empty Section */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
          Local Sandbox Mode
        </span>
      </div>

      {/* Control Utility Actions */}
      <div className="flex items-center gap-4">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full border border-white dark:border-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl p-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-300">Platform Notifications</h4>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Clear all</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 text-xs">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-800 dark:text-slate-300 block font-semibold">AI Assistant Ready</span>
                    <span className="text-slate-500 dark:text-slate-550">Milestone 1 project foundation initialized.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card & Logout */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
            />
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block leading-tight">
                {user.displayName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Rep: {user.reputationScore}
              </span>
            </div>
            <button 
              onClick={logout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
export default TopBar;
