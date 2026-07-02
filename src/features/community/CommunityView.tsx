import React from 'react';
import { Share2 } from 'lucide-react';

export const CommunityView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Community Hub</h1>
        <p className="text-slate-400 text-sm">
          Discover, clone, and comment on public designs.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Share2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 12 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          Hobbyists will publish layouts, fork revisions, and record troubleshooting notes. Experience forms feed the automated learning rules.
        </p>
      </div>
    </div>
  );
};
export default CommunityView;
