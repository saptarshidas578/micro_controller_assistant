import React from 'react';
import { Cpu, AlertTriangle, ShieldCheck, GitFork, PlusCircle, HelpCircle, Activity, Sparkles, Folder, Eye } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Engineering Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Welcome back, <span className="text-blue-600 dark:text-blue-400 font-semibold">{user?.displayName}</span>. Monitor configurations, validations, and knowledge metrics.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <PlusCircle className="w-4 h-4" />
          <span>New Design</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: System Status */}
        <div className="glass-panel rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-ping" />
                Operational
              </span>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">System Status</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">
              Electrical validation, graph indexer, and serverless compile engines are active.
            </p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Latency: 42ms</span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>

        {/* Card 2: Hardware Registry Statistics */}
        <div className="glass-panel rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Global Registry
              </span>
              <Cpu className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Registry Statistics</h3>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div className="bg-slate-100/60 dark:bg-slate-950/40 p-2 rounded border border-slate-200 dark:border-slate-800/40">
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Boards</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">142</span>
              </div>
              <div className="bg-slate-100/60 dark:bg-slate-950/40 p-2 rounded border border-slate-200 dark:border-slate-800/40">
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Components</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">12,490</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Verified Rules: 4,821</span>
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Browse →</span>
          </div>
        </div>

        {/* Card 3: AI Suggestions */}
        <div className="glass-panel rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                AI Assistant
              </span>
              <Sparkles className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">AI Safety Recommendations</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 italic">
              "No active designs loaded. Connect components in the Builder to query safety predictions."
            </p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-slate-400 dark:text-slate-500">
            Powered by Gemini 1.5 Pro RAG pipeline
          </div>
        </div>

        {/* Card 4: Recent Projects */}
        <div className="glass-panel rounded-xl p-5 shadow-lg md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Workspace
              </span>
              <Folder className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Recent Projects</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg hover:border-slate-350 dark:hover:border-slate-700/60 transition-all cursor-pointer">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">ESP32 IoT Greenhouse</h4>
                  <p className="text-xs text-slate-500 mt-0.5">ESP32 DevKitC + DHT22 + I2C OLED</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Safe</span>
                  <span>v1.2</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg hover:border-slate-350 dark:hover:border-slate-700/60 transition-all cursor-pointer">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Arduino Drone Flight Controller</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Arduino Nano + MPU6050 + RF24</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><AlertTriangle className="w-3.5 h-3.5" /> 1 Warning</span>
                  <span>v0.4</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-right">
            View All Projects ({'{mock_count: 5}'}) →
          </div>
        </div>

        {/* Card 5: Saved Drafts */}
        <div className="glass-panel rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Drafts
              </span>
              <Eye className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Saved Layout Drafts</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">
              You have 3 unsaved connection layouts locally cached.
            </p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Manage Cached Layouts →
          </div>
        </div>

        {/* Card 6: Community Activity */}
        <div className="glass-panel rounded-xl p-5 shadow-lg md:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                Community Node Updates
              </span>
              <GitFork className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Recent Community Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="p-3 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/30 rounded-lg">
                <span className="text-slate-800 dark:text-slate-300 font-semibold block">@embedded_ninja</span>
                <span className="text-slate-500">Forked ESP32 Greenhouse</span>
                <p className="mt-1 text-slate-450 dark:text-slate-550 font-mono">14 minutes ago</p>
              </div>
              <div className="p-3 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/30 rounded-lg">
                <span className="text-slate-800 dark:text-slate-300 font-semibold block">@circuit_builder</span>
                <span className="text-slate-500">Added failure case for DHT22</span>
                <p className="mt-1 text-slate-450 dark:text-slate-550 font-mono">2 hours ago</p>
              </div>
              <div className="p-3 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/30 rounded-lg">
                <span className="text-slate-800 dark:text-slate-300 font-semibold block">@robotics_prof</span>
                <span className="text-slate-500">Added STM32 Nucleo configuration</span>
                <p className="mt-1 text-slate-450 dark:text-slate-550 font-mono">1 day ago</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-right">
            Visit Community Forum →
          </div>
        </div>

      </div>
    </div>
  );
};
export default DashboardView;
