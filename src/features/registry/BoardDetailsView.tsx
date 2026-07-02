import React from 'react';
import { BoardSpec, Library, Manufacturer } from '../../types';
import { Cpu, ArrowLeft, Download, ShieldCheck, Heart, BookOpen, Star } from 'lucide-react';

interface BoardDetailsProps {
  board: BoardSpec;
  manufacturerName: string;
  compatibleLibs: Library[];
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const BoardDetailsView: React.FC<BoardDetailsProps> = ({
  board,
  manufacturerName,
  compatibleLibs,
  onBack,
  isFavorite,
  onToggleFavorite
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
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
            <img 
              src={board.imageURL} 
              alt={board.name} 
              className="w-32 h-32 mx-auto rounded-xl object-contain bg-slate-100 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-800"
            />
            <h2 className="text-xl font-bold mt-4 text-slate-950 dark:text-slate-100">{board.name}</h2>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{manufacturerName}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-3">{board.description}</p>
          </div>

          {/* Quick Technical Specs */}
          <div className="glass-panel rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-850 dark:text-slate-200">
              System Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">CPU Core</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{board.cpu}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Frequency</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{board.clockSpeed}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">SRAM Size</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{board.ram}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Flash ROM</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{board.flash}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Voltage</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{board.operatingVoltage}V</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Max Current</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{board.maxCurrent}mA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Pin Mapping and Libraries */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pins Allocation Mapping */}
          <div className="glass-panel rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-4 flex items-center justify-between">
              <span>GPIO Pin Mappings</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {board.gpioCount} Pins Available
              </span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                    <th className="py-2">Pin Name</th>
                    <th className="py-2">Logic Type</th>
                    <th className="py-2">Logic Voltage</th>
                    <th className="py-2">Pin Direction</th>
                    <th className="py-2">Default Bus Mapping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-350">
                  {board.pins.map((pin, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="py-2.5 font-bold font-mono text-slate-900 dark:text-slate-100">{pin.name}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                          pin.type === 'Power' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          pin.type === 'GND' ? 'bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-400' :
                          pin.type === 'I2C' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          'bg-green-500/10 text-green-600 dark:text-green-400'
                        }`}>
                          {pin.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono">{pin.voltage}V</td>
                      <td className="py-2.5 font-mono">{pin.direction || 'Bi'}</td>
                      <td className="py-2.5 text-blue-600 dark:text-blue-400 font-mono font-semibold">{pin.label || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compatible Libraries and Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Frameworks Card */}
            <div className="glass-panel rounded-2xl p-6 shadow-md">
              <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-3">Supported Frameworks</h4>
              <div className="flex flex-wrap gap-2">
                {board.supportedFrameworks.map((fw, i) => (
                  <span key={i} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    {fw}
                  </span>
                ))}
              </div>
            </div>

            {/* Libraries Card */}
            <div className="glass-panel rounded-2xl p-6 shadow-md">
              <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-3">Compatible Core Libraries</h4>
              <div className="space-y-2">
                {compatibleLibs.length > 0 ? (
                  compatibleLibs.map((lib, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-lg">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{lib.name}</span>
                      <span className="font-mono text-slate-400 dark:text-slate-550">{lib.version}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No registered companion libraries listed.</p>
                )}
              </div>
            </div>

          </div>

          {/* Technical Documentation Links */}
          <div className="glass-panel rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Datasheets & Schematic Resources</h4>
                <p className="text-xs text-slate-500">Read official manufacturer specifications sheets.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a 
                href={board.datasheetLink} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Datasheet PDF
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default BoardDetailsView;
