import React from 'react';
import { Project, BoardSpec, ComponentSpec } from '../../types';
import { HardwareImage } from '../../components/ui/HardwareImage';
import { ShieldCheck, Award, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface StepSummaryViewProps {
  projectData: Partial<Project>;
  board: BoardSpec | null;
  componentsData: ComponentSpec[];
}

export const StepSummaryView: React.FC<StepSummaryViewProps> = ({
  projectData,
  board,
  componentsData
}) => {
  const compCount = projectData.components?.reduce((acc, c) => acc + c.quantity, 0) || 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 6: Project Summary & Review</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Review specifications, compile layout elements, and preview firmware or validation states before saving.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Summary overview */}
        <div className="md:col-span-2 space-y-5">
          {/* Board review */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {board ? (
                <>
                  <HardwareImage category="board" name={board.name} className="w-12 h-12" />
                  <div>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">Selected Board</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{board.name}</h4>
                    <span className="text-[10px] text-slate-450 font-mono">CPU: {board.cpu} | {board.operatingVoltage}V</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500">No board selected. Please return to Step 2.</div>
              )}
            </div>
          </div>

          {/* Component list review */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Selected Components ({compCount} items)
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {projectData.components && projectData.components.length > 0 ? (
                projectData.components.map(item => {
                  const compSpec = componentsData.find(c => c.id === item.componentId);
                  if (!compSpec) return null;

                  return (
                    <div key={item.instanceId} className="flex items-center justify-between py-2 text-xs">
                      <div className="flex items-center gap-3">
                        <HardwareImage category={compSpec.category} name={compSpec.name} className="w-8 h-8" />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {compSpec.name} {item.customLabel ? `("${item.customLabel}")` : ''}
                          </span>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 block">Category: {compSpec.category}</span>
                        </div>
                      </div>
                      <span className="font-mono text-slate-500 font-bold">Qty: {item.quantity}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-3">No components selected. Return to Step 3.</p>
              )}
            </div>
          </div>

          {/* Firmware block placeholder */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Firmware Blueprint</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Firmware auto-generation and dynamic logic code compile controls are locked. They will be resolved in **Milestone 6: Firmware Generation**.
            </p>
            <pre className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-lg text-left text-[10px] text-slate-400 border border-slate-200 dark:border-slate-850 font-mono">
              {`// Auto-Generated Setup Template\nvoid setup() {\n  // Hardware bindings initialization placeholder\n}\n\nvoid loop() {\n  // Sensor reading placeholder\n}`}
            </pre>
          </div>
        </div>

        {/* Right Side: AI Review & Validation placeholder */}
        <div className="space-y-6">
          {/* AI Review Gauge Placeholder */}
          <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>AI Review Analytics</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Interactive compatibility reports and design safety ratings will be unlocked in **Milestone 9: AI Hardware Review**.
            </p>
            
            <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-250 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block font-mono">AI Verification Unchecked</span>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="w-0 bg-blue-500 h-full transition-all" />
              </div>
            </div>
          </div>

          {/* Validation Warnings Placeholder */}
          <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Electrical Verification</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Short-circuit and hardware pins check validations will trigger in **Milestone 5: Electrical Validation**.
            </p>

            <div className="flex gap-2.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-600 dark:text-blue-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Design Pending Check</span>
                <span>Run validation to verify connection maps.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default StepSummaryView;
