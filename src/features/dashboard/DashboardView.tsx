import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, ShieldCheck, GitFork, PlusCircle, HelpCircle, Activity, Sparkles, Folder, Eye, Loader2, Edit3, Trash2, Copy, FileSignature } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchUserProjects, deleteProjectDraft, duplicateProjectDraft, updateProjectDraft } from '../../services/projects';
import { fetchBoards } from '../../services/registry';
import { Project, BoardSpec } from '../../types';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [boards, setBoards] = useState<BoardSpec[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog/modal states for renaming
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const projs = await fetchUserProjects(user.uid);
      const brds = await fetchBoards();
      setProjects(projs);
      setBoards(brds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleCreateNew = () => {
    navigate('/builder');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project draft?")) {
      const success = await deleteProjectDraft(id);
      if (success) {
        setProjects(projects.filter(p => p.id !== id));
      }
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      const duplicated = await duplicateProjectDraft(user.uid, id);
      if (duplicated) {
        setProjects([duplicated, ...projects]);
      }
    }
  };

  const handleStartRename = (proj: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProjId(proj.id);
    setRenameValue(proj.title);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProjId && renameValue.trim()) {
      const updated = await updateProjectDraft(editingProjId, { title: renameValue });
      if (updated) {
        setProjects(projects.map(p => p.id === editingProjId ? updated : p));
      }
      setEditingProjId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-sm text-slate-500 font-mono">LOADING WORKSPACE TELEMETRY...</span>
      </div>
    );
  }

  // Calculate statistics
  const totalDrafts = projects.length;
  const verifiedSafe = projects.filter(p => p.validationIssues.length === 0 && p.boardId).length;

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
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
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
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">System Status</h3>
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
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Registry Statistics</h3>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div className="bg-slate-100/60 dark:bg-slate-950/40 p-2 rounded border border-slate-200 dark:border-slate-800/40">
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Boards</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">20</span>
              </div>
              <div className="bg-slate-100/60 dark:bg-slate-950/40 p-2 rounded border border-slate-200 dark:border-slate-800/40">
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Components</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">100</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Verified Rules: 4,821</span>
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => navigate('/registry')}>Browse →</span>
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
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">AI Safety Recommendations</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 italic">
              {totalDrafts > 0 
                ? `"Run validation checks inside summary review sheets to map AI reviews."`
                : `"No active designs loaded. Connect components in the Builder to query safety predictions."`
              }
            </p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-slate-400 dark:text-slate-500">
            Powered by Gemini 1.5 Pro RAG pipeline
          </div>
        </div>

        {/* Card 4: Recent Projects (DRAFTS LIST) */}
        <div className="glass-panel rounded-xl p-5 shadow-lg md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Workspace Drafts
              </span>
              <Folder className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 text-sm">Recent Active Designs</h3>
            
            <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
              {projects.length > 0 ? (
                projects.map(proj => {
                  const brdName = boards.find(b => b.id === proj.boardId)?.name || 'Generic Board';
                  return (
                    <div 
                      key={proj.id}
                      onClick={() => navigate(`/builder/${proj.id}`)}
                      className="flex items-center justify-between p-3 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg hover:border-slate-350 dark:hover:border-slate-700/60 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-500 transition-colors">
                          {proj.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{brdName} | {proj.components.length} components</p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={(e) => handleStartRename(proj, e)}
                          title="Rename Draft" 
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <FileSignature className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDuplicate(proj.id, e)}
                          title="Duplicate Draft" 
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(proj.id, e)}
                          title="Delete Draft" 
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold px-2 py-0.5 bg-blue-500/10 rounded">
                          v{proj.version}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <p className="text-xs text-slate-500">No layout drafts created yet. Launch the builder to get started.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between">
            <span>Total Saved Configurations: {totalDrafts}</span>
            <button onClick={handleCreateNew} className="hover:underline">Launch Visual Builder →</button>
          </div>
        </div>

        {/* Card 5: Saved Drafts Status */}
        <div className="glass-panel rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Telemetry
              </span>
              <Eye className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Design Validations</h3>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Verified Layouts</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{verifiedSafe}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Errors Reported</span>
                <span className="font-bold text-red-500">0</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 text-xs text-slate-400">
            Pending GPIO validation mapping steps.
          </div>
        </div>

      </div>

      {/* Rename dialog Modal */}
      {editingProjId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveRename}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Rename Project Draft</h3>
            <input 
              type="text" 
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-200"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button 
                type="button" 
                onClick={() => setEditingProjId(null)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-755"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
export default DashboardView;
