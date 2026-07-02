import React from 'react';
import { Cpu, Search } from 'lucide-react';

export const RegistryView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Global Hardware Registry</h1>
        <p className="text-slate-400 text-sm">
          Browse and filter certified development boards and components.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 max-w-md">
        <Search className="w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search boards, sensors, displays..." 
          disabled
          className="bg-transparent text-sm text-slate-200 outline-none w-full cursor-not-allowed"
        />
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 3 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          The registry service will index Boards, Sensors, and Drivers. This catalog will power the canvas auto-complete and recommendations engine.
        </p>
      </div>
    </div>
  );
};
export default RegistryView;
