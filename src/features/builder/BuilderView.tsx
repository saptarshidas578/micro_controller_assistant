import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  fetchProjectById, saveProjectDraft, 
  updateProjectDraft, deleteProjectDraft 
} from '../../services/projects';
import { fetchBoards, fetchComponents, fetchManufacturers, fetchCategories } from '../../services/registry';
import { BoardSpec, ComponentSpec, Manufacturer, Project, ProjectComponent } from '../../types';

// Step Subcomponents
import { StepInfoForm } from './StepInfoForm';
import { StepBoardSelector } from './StepBoardSelector';
import { StepComponentSelector } from './StepComponentSelector';
import { StepPowerConfig } from './StepPowerConfig';
import { StepCommunicationOverview } from './StepCommunicationOverview';
import { StepSummaryView } from './StepSummaryView';

import { 
  Loader2, Save, Undo2, ArrowLeft, ArrowRight, 
  Trash2, Copy, AlertTriangle, ShieldCheck, RefreshCw 
} from 'lucide-react';

const STEPS = [
  "Project Info",
  "Board Selection",
  "Components Selection",
  "Power Config",
  "Communication",
  "Review & Summary"
];

export const BuilderView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const [searchParams] = useSearchParams();

  // Registry data pools
  const [boards, setBoards] = useState<BoardSpec[]>([]);
  const [components, setComponents] = useState<ComponentSpec[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Wizard state machine
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Project Draft State
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'IoT',
    difficulty: 'Beginner',
    estimatedBuildTime: '',
    tags: [],
    boardId: '',
    components: [],
    connections: [],
    isPublic: false,
    draftStatus: 'draft',
    estimatedCostUsd: 0,
    version: '1.0.0',
    timeline: [],
    validationIssues: [],
    powerConfig: {
      source: 'USB',
      voltage: 3.3,
      currentBudgetMa: 500,
      estimatedPowerW: 0.1
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recoveryAvailable, setRecoveryAvailable] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load registry data and existing project if editing
  useEffect(() => {
    const initBuilder = async () => {
      setLoading(true);
      try {
        const boardsData = await fetchBoards();
        const componentsData = await fetchComponents();
        const mfrs = await fetchManufacturers();
        const cats = await fetchCategories();

        setBoards(boardsData);
        setComponents(componentsData);
        setManufacturers(mfrs);
        setCategories(cats);

        if (projectId) {
          const existingProject = await fetchProjectById(projectId);
          if (existingProject) {
            setProject(existingProject);
          } else {
            setError("The requested project draft could not be found.");
          }
        } else {
          // Check local recovery backups if starting new
          const backup = localStorage.getItem('builder_draft_backup');
          if (backup) {
            setRecoveryAvailable(true);
          }
        }
      } catch (err) {
        setError("Failed to initialize builder catalog registry. Please reload.");
      } finally {
        setLoading(false);
      }
    };

    initBuilder();
  }, [projectId]);

  // Auto-save logic (every 2 minutes)
  useEffect(() => {
    if (hasUnsavedChanges && user) {
      autoSaveTimerRef.current = setTimeout(() => {
        handleSaveDraft(true); // silent auto-save
      }, 120000);
    }

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [hasUnsavedChanges, project, user]);

  // Warn user on close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved wiring changes in your project builder. Are you sure you want to exit?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Recovery trigger
  const handleRestoreBackup = () => {
    const backup = localStorage.getItem('builder_draft_backup');
    if (backup) {
      setProject(JSON.parse(backup));
      setRecoveryAvailable(false);
      setHasUnsavedChanges(true);
    }
  };

  const handleClearBackup = () => {
    localStorage.removeItem('builder_draft_backup');
    setRecoveryAvailable(false);
  };

  // State update handler
  const handleProjectUpdate = (updates: Partial<Project>) => {
    setProject(prev => {
      const next = { ...prev, ...updates };
      // Save local backup copy for emergency recovery
      localStorage.setItem('builder_draft_backup', JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Selected Board specifications helper
  const selectedBoard = boards.find(b => b.id === project.boardId) || null;

  // Step 2 Selection
  const handleSelectBoard = (boardId: string) => {
    handleProjectUpdate({ boardId });
  };

  // Step 3 Selection components
  const handleAddComponent = (componentId: string) => {
    const compList = [...(project.components || [])];
    const instanceId = `inst_${compList.length + 1}_${componentId}`;
    compList.push({
      instanceId,
      componentId,
      quantity: 1,
      customLabel: ''
    });
    handleProjectUpdate({ components: compList });
  };

  const handleRemoveComponent = (componentId: string) => {
    const compList = (project.components || []).filter(c => c.componentId !== componentId);
    handleProjectUpdate({ components: compList });
  };

  const handleUpdateComponentQty = (componentId: string, quantity: number) => {
    const compList = (project.components || []).map(c => 
      c.componentId === componentId ? { ...c, quantity } : c
    );
    handleProjectUpdate({ components: compList });
  };

  const handleUpdateComponentLabel = (componentId: string, customLabel: string) => {
    const compList = (project.components || []).map(c => 
      c.componentId === componentId ? { ...c, customLabel } : c
    );
    handleProjectUpdate({ components: compList });
  };

  // Save draft trigger
  const handleSaveDraft = async (silent = false) => {
    if (!user) return;
    if (!silent) setIsSaving(true);
    
    try {
      if (projectId) {
        await updateProjectDraft(projectId, project);
      } else {
        const saved = await saveProjectDraft(user.uid, user.displayName || 'Developer', project as any);
        // Clear emergency recovery backup since it's saved in DB
        localStorage.removeItem('builder_draft_backup');
        // Route to edit page for saved draft
        navigate(`/builder/${saved.id}`, { replace: true });
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-sm text-slate-500 font-mono">LOADING BUILDER ENVIRONMENT...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl max-w-lg mx-auto text-center mt-12">
        <h3 className="font-bold">Initialization Failed</h3>
        <p className="text-xs mt-2">{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Save Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
            {projectId ? `Edit Project: ${project.title || 'Untitled Draft'}` : 'Visual Project Builder'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Configure system parameters, add components, and save workspace layouts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {hasUnsavedChanges && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Unsaved Changes
            </span>
          )}
          
          <button
            onClick={() => handleSaveDraft(false)}
            disabled={isSaving || !project.title}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm rounded-lg shadow-lg disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Recovery Backup banner */}
      {recoveryAvailable && (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div>
              <h4 className="text-xs font-bold">Emergency Auto-save Backup Found</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">An unsaved project layout was found locally. Would you like to restore it?</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleRestoreBackup}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-md"
            >
              Restore Draft
            </button>
            <button 
              onClick={handleClearBackup}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-semibold rounded-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Progress Wizard Steps */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] px-4">
          {STEPS.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isActive = activeStep === idx;

            return (
              <React.Fragment key={step}>
                <div 
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[11px] font-semibold transition-all ${
                    isActive ? 'text-blue-600 dark:text-blue-400 font-bold' :
                    isCompleted ? 'text-green-600 dark:text-green-400' :
                    'text-slate-400 group-hover:text-slate-650'
                  }`}>
                    {step}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${activeStep > idx ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Active Step Container */}
      <div className="p-1">
        {activeStep === 0 && (
          <StepInfoForm 
            projectData={project} 
            onChange={handleProjectUpdate} 
          />
        )}
        {activeStep === 1 && (
          <StepBoardSelector 
            boards={boards} 
            manufacturers={manufacturers}
            selectedBoardId={project.boardId || ''} 
            onSelectBoard={handleSelectBoard} 
          />
        )}
        {activeStep === 2 && (
          <StepComponentSelector 
            components={components} 
            categories={categories}
            selectedComponents={project.components || []} 
            onAddComponent={handleAddComponent} 
            onRemoveComponent={handleRemoveComponent} 
            onUpdateComponentQty={handleUpdateComponentQty} 
            onUpdateComponentLabel={handleUpdateComponentLabel} 
          />
        )}
        {activeStep === 3 && (
          <StepPowerConfig 
            projectData={project} 
            componentsData={components} 
            onChange={handleProjectUpdate} 
          />
        )}
        {activeStep === 4 && (
          <StepCommunicationOverview 
            projectData={project} 
            componentsData={components} 
          />
        )}
        {activeStep === 5 && (
          <StepSummaryView 
            projectData={project} 
            board={selectedBoard} 
            componentsData={components} 
          />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-5">
        <button
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <button
          onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
          disabled={activeStep === STEPS.length - 1 || (activeStep === 1 && !project.boardId)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          <span>Next Step</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
export default BuilderView;
