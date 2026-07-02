import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { 
  LayoutDashboard, Cpu, Layers, FolderHeart, Database, 
  Share2, Search, Settings, ShieldAlert, Cpu as BrandIcon 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Hardware Registry', path: '/registry', icon: Cpu },
    { name: 'Project Builder', path: '/builder', icon: Layers },
    { name: 'Projects', path: '/projects', icon: FolderHeart },
    { name: 'Knowledge Base', path: '/knowledge', icon: Database },
    { name: 'Community', path: '/community', icon: Share2 },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/20">
        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-1.5 rounded-lg">
          <BrandIcon className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
          ANTIGRAVITY
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`
            }
          >
            <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Admin Navigation Entry */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
              }`
            }
          >
            <ShieldAlert className="w-4 h-4 group-hover:scale-110 transition-transform text-purple-500" />
            <span>Admin Control</span>
          </NavLink>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/10 text-center">
        <span className="text-[10px] font-mono text-slate-600 tracking-wider">
          SANDBOX VERSION 0.1.0
        </span>
      </div>
    </aside>
  );
};
export default Sidebar;
