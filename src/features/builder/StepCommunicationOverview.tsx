import React from 'react';
import { Project, ComponentSpec } from '../../types';
import { HardwareImage } from '../../components/ui/HardwareImage';
import { Network, CheckCircle, HelpCircle } from 'lucide-react';

interface StepCommunicationOverviewProps {
  projectData: Partial<Project>;
  componentsData: ComponentSpec[];
}

export const StepCommunicationOverview: React.FC<StepCommunicationOverviewProps> = ({
  projectData,
  componentsData
}) => {
  // Aggregate required protocols dynamically
  const protocolRequirements: Record<string, ComponentSpec[]> = {};

  projectData.components?.forEach(item => {
    const compSpec = componentsData.find(c => c.id === item.componentId);
    if (compSpec) {
      const proto = compSpec.protocol || 'GPIO';
      if (!protocolRequirements[proto]) {
        protocolRequirements[proto] = [];
      }
      if (!protocolRequirements[proto].some(c => c.id === compSpec.id)) {
        protocolRequirements[proto].push(compSpec);
      }
    }
  });

  const activeProtocols = Object.keys(protocolRequirements);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 5: Communication Overview</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Review required bus types and preview pin assignments for your design layout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Active Protocols list */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Required Communication Buses</h4>
          
          {activeProtocols.length > 0 ? (
            <div className="space-y-3">
              {activeProtocols.map(proto => (
                <div key={proto} className="glass-panel rounded-2xl p-5 shadow-sm border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">{proto} Interface</span>
                    <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded font-bold font-mono">Auto-Resolved</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 block font-semibold">Associated Components:</span>
                    <div className="flex flex-wrap gap-2">
                      {protocolRequirements[proto].map(comp => (
                        <div key={comp.id} className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg text-xs">
                          <HardwareImage category={comp.category} name={comp.name} className="w-5 h-5" />
                          <span className="font-medium text-slate-700 dark:text-slate-350">{comp.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6">No components added yet. Add components in the previous step to map protocol bindings.</p>
          )}
        </div>

        {/* Right Side: GPIO Pinout Layout Mapper Placeholder */}
        <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            <span>Pin Assignment</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            A visual pinout configuration dashboard allowing mapping custom physical pin headers (e.g. mapping I2C SDA to GPIO21) will be unlocked in **Milestone 4: Pinout Connection Mapping**.
          </p>

          <div className="border border-dashed border-slate-250 dark:border-slate-800 rounded-xl p-4 text-center bg-slate-50/50 dark:bg-slate-950/20">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider font-mono">Pin Mapping Locked</span>
            <span className="text-[9px] text-slate-400 mt-1 block">Requires selecting a board and components.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
export default StepCommunicationOverview;
