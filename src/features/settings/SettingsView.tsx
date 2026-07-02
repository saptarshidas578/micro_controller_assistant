import React from 'react';
import { Settings } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Configuration Settings</h1>
        <p className="text-slate-400 text-sm">
          Adjust user profile configurations, token API keys, and workspace modes.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Settings className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 1 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          Adjust project configurations, connect your own Firebase APIs, or configure dark/light theme presets.
        </p>
      </div>
    </div>
  );
};
export default SettingsView;
