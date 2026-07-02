import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const AdminView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Administrator Panel</h1>
        <p className="text-slate-400 text-sm">
          Moderate the hardware registry queue, verify confidence scores, and audit user reviews.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 14 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          Administrator exclusive controls: review AI datasheet parser outputs, confirm component metadata, and edit global rules mapping.
        </p>
      </div>
    </div>
  );
};
export default AdminView;
