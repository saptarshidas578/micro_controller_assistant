import React from 'react';
import { Project, ComponentSpec } from '../../types';
import { ShieldCheck, Zap, Battery, Cpu, AlertTriangle } from 'lucide-react';

interface StepPowerConfigProps {
  projectData: Partial<Project>;
  componentsData: ComponentSpec[];
  onChange: (updates: Partial<Project>) => void;
}

export const StepPowerConfig: React.FC<StepPowerConfigProps> = ({
  projectData,
  componentsData,
  onChange
}) => {
  const powerConfig = projectData.powerConfig || {
    source: 'USB',
    voltage: 3.3,
    currentBudgetMa: 500,
    estimatedPowerW: 0.1
  };

  // Calculate dynamic current specs from active design components list
  let totalTypicalCurrent = 0;
  let totalMaxCurrent = 0;

  projectData.components?.forEach(item => {
    const compSpec = componentsData.find(c => c.id === item.componentId);
    if (compSpec) {
      totalTypicalCurrent += compSpec.typicalCurrent * item.quantity;
      totalMaxCurrent += compSpec.maxCurrent * item.quantity;
    }
  });

  // Basic estimation of total wattage: P = V * I
  const typicalPowerW = parseFloat(((powerConfig.voltage * totalTypicalCurrent) / 1000).toFixed(3));
  const maxPowerW = parseFloat(((powerConfig.voltage * totalMaxCurrent) / 1000).toFixed(3));

  const handleSourceChange = (source: 'USB' | 'Battery' | 'External') => {
    onChange({
      powerConfig: {
        ...powerConfig,
        source
      }
    });
  };

  const handleVoltageChange = (voltage: 3.3 | 5.0) => {
    onChange({
      powerConfig: {
        ...powerConfig,
        voltage
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 4: Power Configuration</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure voltage specifications, power source paths, and monitor estimated project electrical loads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Options panel */}
        <div className="space-y-5">
          {/* Power Source Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Main Power Source</label>
            <div className="grid grid-cols-3 gap-3">
              {(['USB', 'Battery', 'External'] as const).map(src => {
                const isActive = powerConfig.source === src;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => handleSourceChange(src)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-600 border-blue-500/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {src === 'Battery' ? <Battery className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    <span>{src}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logic Voltage Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wide">Operating Logic Voltage</label>
            <div className="grid grid-cols-2 gap-3">
              {([3.3, 5.0] as const).map(volts => {
                const isActive = powerConfig.voltage === volts;
                return (
                  <button
                    key={volts}
                    type="button"
                    onClick={() => handleVoltageChange(volts)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-600 border-blue-500/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>{volts}V DC</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Telemetry panel */}
        <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Estimated Electrical Load</h4>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg">
              <span className="text-slate-450 dark:text-slate-500">Typical Load</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalTypicalCurrent} mA</span>
            </div>
            
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg">
              <span className="text-slate-450 dark:text-slate-500">Peak Load</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalMaxCurrent} mA</span>
            </div>

            {/* Estimated Power placeholder */}
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg">
              <span className="text-slate-450 dark:text-slate-500">Power Rating</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{typicalPowerW} W (typical)</span>
            </div>
          </div>

          {/* Validation Warnings placeholders */}
          {totalMaxCurrent > 450 ? (
            <div className="flex gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Current Draw Warning</span>
                <span>Peak current exceeds 450mA. Ensure your power supply rail can handle high loads to prevent MCU brownouts.</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-2.5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] text-green-600 dark:text-green-400">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Safe Current Margin</span>
                <span>Calculated loads are within normal parameters for standard USB host ports.</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default StepPowerConfig;
