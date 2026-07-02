import React from 'react';
import { ComponentSpec, Library } from '../../types';
import { ArrowLeft, Heart, FileText, Settings, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface ComponentDetailsProps {
  component: ComponentSpec;
  manufacturerName: string;
  requiredLibs: Library[];
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  alternativeComponentNames: string[];
}

export const ComponentDetailsView: React.FC<ComponentDetailsProps> = ({
  component,
  manufacturerName,
  requiredLibs,
  onBack,
  isFavorite,
  onToggleFavorite,
  alternativeComponentNames
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation Headers */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </button>

        <button 
          onClick={onToggleFavorite}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
            isFavorite 
              ? 'bg-red-500/10 text-red-500 border-red-500/30' 
              : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          <span>{isFavorite ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
      </div>

      {/* Main Info Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image and Specs Card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 text-center shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl" />
            <img 
              src={component.imageURL} 
              alt={component.name} 
              className="w-32 h-32 mx-auto rounded-xl object-contain bg-slate-100 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-800"
            />
            <h2 className="text-xl font-bold mt-4 text-slate-950 dark:text-slate-100">{component.name}</h2>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">{manufacturerName}</p>
            <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono capitalize">
              {component.category}
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-4">{component.description}</p>
          </div>

          {/* Quick Technical Specs */}
          <div className="glass-panel rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-850 dark:text-slate-200">
              System Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Voltage</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{component.operatingVoltage}V</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Max Voltage</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{component.maxVoltage}V</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Typical Current</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{component.typicalCurrent}mA</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Max Current</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{component.maxCurrent}mA</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Bus Interface</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{component.protocol}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Pin Count</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{component.pinCount} Pins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Pin Mapping, Firmware, Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pins Table */}
          <div className="glass-panel rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-4">
              Component Pin Specifications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                    <th className="py-2">Pin Name</th>
                    <th className="py-2">Interface Type</th>
                    <th className="py-2">Logic Voltage</th>
                    <th className="py-2">Direction</th>
                    <th className="py-2">Pin Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-350">
                  {component.pins.map((pin, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="py-2.5 font-bold font-mono text-slate-900 dark:text-slate-100">{pin.name}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          pin.type === 'Power' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          pin.type === 'GND' ? 'bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-400' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {pin.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono">{pin.voltage}V</td>
                      <td className="py-2.5 font-mono">{pin.direction || 'Bi'}</td>
                      <td className="py-2.5">
                        {component.mandatoryPins.includes(pin.name) ? (
                          <span className="text-[10px] text-red-500 font-semibold bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">Required</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Optional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Example Code & Required Libraries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Required Libraries */}
            <div className="glass-panel rounded-2xl p-6 shadow-md md:col-span-1">
              <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-3">Required Libraries</h4>
              <div className="space-y-2">
                {requiredLibs.length > 0 ? (
                  requiredLibs.map((lib, i) => (
                    <div key={i} className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{lib.name}</span>
                      <span className="font-mono text-slate-400 dark:text-slate-500 text-[10px]">{lib.author}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Uses standard native GPIO bindings.</p>
                )}
              </div>
            </div>

            {/* Code Snippet Example */}
            <div className="glass-panel rounded-2xl p-6 shadow-md md:col-span-2 flex flex-col">
              <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Firmware Initialization</span>
              </h4>
              <pre className="flex-1 p-3 bg-slate-100 dark:bg-slate-950/80 rounded-lg text-left text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-850 font-mono">
                {component.initializationExample}
              </pre>
            </div>

          </div>

          {/* Notes, Known Issues and Alternatives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Engineering Notes & Failures */}
            <div className="glass-panel rounded-2xl p-6 shadow-md space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-355 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Failure Prevention & Warnings</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside">
                {component.knownIssues.map((issue, i) => (
                  <li key={i}><span className="text-slate-700 dark:text-slate-300">{issue}</span></li>
                ))}
              </ul>
            </div>

            {/* Design & Wiring Tips */}
            <div className="glass-panel rounded-2xl p-6 shadow-md space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-355 flex items-center gap-1.5 uppercase tracking-wider">
                <Settings className="w-4 h-4 text-green-500" />
                <span>Engineering Design Tips</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside">
                {component.engineeringTips.map((tip, i) => (
                  <li key={i}><span className="text-slate-700 dark:text-slate-300">{tip}</span></li>
                ))}
              </ul>
            </div>

          </div>

          {/* Footer Info: Alternatives & Datasheet */}
          <div className="glass-panel rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Alternative Parts & Docs</h4>
                <p className="text-xs text-slate-500">
                  {alternativeComponentNames.length > 0 
                    ? `Drop-in replacement options: ${alternativeComponentNames.join(', ')}`
                    : 'No designated alternatives listed.'
                  }
                </p>
              </div>
            </div>
            <a 
              href={component.datasheetLink} 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              Datasheet Document
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
export default ComponentDetailsView;
