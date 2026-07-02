import React from 'react';
import { Project } from '../../types';

interface StepInfoFormProps {
  projectData: Partial<Project>;
  onChange: (updates: Partial<Project>) => void;
}

export const StepInfoForm: React.FC<StepInfoFormProps> = ({ projectData, onChange }) => {
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onChange({ tags });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 1: Project Information</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Specify the baseline specifications, difficulty levels, and metadata for this embedded design.</p>
      </div>

      <div className="space-y-4">
        {/* Project Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Project Name</label>
          <input 
            type="text" 
            placeholder="e.g. ESP32 Autonomous Plant Watering System" 
            value={projectData.title || ''}
            onChange={e => onChange({ title: e.target.value })}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Description</label>
          <textarea 
            placeholder="Describe the overall goal, circuit connections, and target behavior of your hardware project..." 
            value={projectData.description || ''}
            onChange={e => onChange({ description: e.target.value })}
            rows={4}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Category & Difficulty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Category</label>
            <select
              value={projectData.category || 'IoT'}
              onChange={e => onChange({ category: e.target.value })}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150 cursor-pointer"
            >
              <option value="IoT">Internet of Things (IoT)</option>
              <option value="Robotics">Robotics & Actuators</option>
              <option value="Wearables">Wearables & Health</option>
              <option value="Home Automation">Home Automation</option>
              <option value="Agriculture">Smart Agriculture</option>
              <option value="Education">Educational & Maker Kit</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Difficulty Level</label>
            <select
              value={projectData.difficulty || 'Beginner'}
              onChange={e => onChange({ difficulty: e.target.value as any })}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150 cursor-pointer"
            >
              <option value="Beginner">Beginner (Basic wiring, simple firmware)</option>
              <option value="Intermediate">Intermediate (Multiple buses, state machines)</option>
              <option value="Expert">Expert (Low-power hibernation, multi-sensor RTOS)</option>
            </select>
          </div>
        </div>

        {/* Build Time & Estimated Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Estimated Build Time</label>
            <input 
              type="text" 
              placeholder="e.g. 2 hours" 
              value={projectData.estimatedBuildTime || ''}
              onChange={e => onChange({ estimatedBuildTime: e.target.value })}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Estimated Budget (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-sm text-slate-400 font-mono">$</span>
              <input 
                type="number" 
                placeholder="e.g. 45" 
                value={projectData.estimatedCostUsd || ''}
                onChange={e => onChange({ estimatedCostUsd: parseFloat(e.target.value) || 0 })}
                className="pl-8 pr-4 py-2.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Tags (comma-separated)</label>
          <input 
            type="text" 
            placeholder="wifi, automation, display, sensors" 
            value={projectData.tags?.join(', ') || ''}
            onChange={handleTagChange}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-150"
          />
        </div>

        {/* Visibility & Save Draft Recovery State Placeholders */}
        <div className="pt-4 border-t border-slate-250 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Public Visibility</span>
            <span className="text-[10px] text-slate-500">Allow other users to search and duplicate your layout design.</span>
          </div>
          <button 
            type="button"
            onClick={() => onChange({ isPublic: !projectData.isPublic })}
            className={`w-12 h-6 rounded-full transition-all relative ${projectData.isPublic ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-md ${projectData.isPublic ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
export default StepInfoForm;
