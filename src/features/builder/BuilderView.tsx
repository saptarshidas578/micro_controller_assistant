import React from 'react';
import { Layers } from 'lucide-react';

export const BuilderView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Project Builder</h1>
        <p className="text-slate-400 text-sm">
          Map connections, verify logical GPIO alignments, and test compatibility.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 4 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          An interactive drawing workspace is planned here. You will drag hardware objects, link pins, and view real-time warnings on the canvas.
        </p>
      </div>
    </div>
  );
};
export default BuilderView;
