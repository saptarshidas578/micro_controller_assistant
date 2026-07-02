import React from 'react';
import { Search } from 'lucide-react';

export const SearchView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Semantic Vector Search</h1>
        <p className="text-slate-400 text-sm">
          Run deep search queries matching libraries, components, and layouts semantically.
        </p>
      </div>

      <div className="glass-panel border-dashed border-2 border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-8">
        <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300">Milestone 13 Preview</h3>
        <p className="text-slate-500 text-xs mt-2">
          This panel will run vector embeddings matches through a Pinecone or Firestore index to resolve contextual queries.
        </p>
      </div>
    </div>
  );
};
export default SearchView;
