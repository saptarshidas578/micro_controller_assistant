import React from 'react';
import { Database } from 'lucide-react';

export const KnowledgeView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Engineering Knowledge Base</h1>
        <p className="text-slate-400 text-sm">
          Search hardware compatibility rules and verified pin mappings.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 10 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          The Knowledge Graph lives here. The system links boards to components and failure modes dynamically based on community builds.
        </p>
      </div>
    </div>
  );
};
export default KnowledgeView;
