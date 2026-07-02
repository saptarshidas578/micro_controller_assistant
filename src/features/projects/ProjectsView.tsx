import React from 'react';
import { Folder } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
        <p className="text-slate-400 text-sm">
          Load, save, or clone your development board layouts.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Folder className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 4 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          Your saved designs will load from Firestore and local caches. Version logs allow you to fork or rollback connection histories.
        </p>
      </div>
    </div>
  );
};
export default ProjectsView;
