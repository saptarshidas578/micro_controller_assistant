import React, { useState } from 'react';
import { BoardSpec, Manufacturer } from '../../types';
import { HardwareImage } from '../../components/ui/HardwareImage';
import { Search, SlidersHorizontal, Eye, Scale, CheckCircle2 } from 'lucide-react';

interface StepBoardSelectorProps {
  boards: BoardSpec[];
  manufacturers: Manufacturer[];
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
}

export const StepBoardSelector: React.FC<StepBoardSelectorProps> = ({
  boards,
  manufacturers,
  selectedBoardId,
  onSelectBoard
}) => {
  const [query, setQuery] = useState('');
  const [voltageFilter, setVoltageFilter] = useState<string>('all');
  const [compareList, setCompareList] = useState<BoardSpec[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filters
  const filteredBoards = boards.filter(board => {
    const matchQuery = board.name.toLowerCase().includes(query.toLowerCase()) || 
                       board.cpu.toLowerCase().includes(query.toLowerCase());
    const matchVoltage = voltageFilter === 'all' || board.operatingVoltage.toString() === voltageFilter;
    return matchQuery && matchVoltage;
  });

  const handleToggleCompare = (board: BoardSpec, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some(b => b.id === board.id)) {
      setCompareList(compareList.filter(b => b.id !== board.id));
    } else {
      if (compareList.length >= 2) {
        // Swap out the first one
        setCompareList([compareList[1], board]);
      } else {
        setCompareList([...compareList, board]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 2: Development Board</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Select exactly one core development board to create your project's CPU foundation.</p>
        </div>
        {compareList.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all shrink-0 self-end md:self-auto"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare Boards ({compareList.length})</span>
          </button>
        )}
      </div>

      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 w-full md:max-w-md shadow-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search boards by name, cpu..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={voltageFilter}
            onChange={e => setVoltageFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none shadow-sm cursor-pointer"
          >
            <option value="all">All Voltages</option>
            <option value="3.3">3.3V Logic</option>
            <option value="5">5.0V Logic</option>
          </select>
        </div>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBoards.map(board => {
          const isSelected = selectedBoardId === board.id;
          const isComparing = compareList.some(b => b.id === board.id);
          const mfrName = manufacturers.find(m => m.id === board.manufacturerId)?.name || 'Unknown';

          return (
            <div
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className={`glass-panel rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer relative group transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 border-transparent shadow-blue-500/5' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <HardwareImage category="board" name={board.name} className="w-14 h-14" />
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => handleToggleCompare(board, e)}
                      className={`p-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                        isComparing 
                          ? 'bg-blue-600/10 text-blue-600 border-blue-500/20' 
                          : 'border-slate-250 dark:border-slate-800 text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Compare
                    </button>
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors leading-tight">
                  {board.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{mfrName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">{board.description}</p>
              </div>

              {/* Pin previews */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-500 font-mono">
                <span>Core: {board.cpu}</span>
                <span>{board.gpioCount} Pins</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Modal */}
      {showCompareModal && compareList.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-250 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Board Specifications Comparison</h3>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-3 gap-4 text-xs">
                {/* Header row */}
                <div className="font-semibold text-slate-500">Spec Metric</div>
                {compareList.map(b => (
                  <div key={b.id} className="font-bold text-slate-900 dark:text-slate-100 truncate">{b.name}</div>
                ))}

                {/* Rows */}
                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">Processor</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.cpu}</div>
                ))}

                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">Clock Speed</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.clockSpeed}</div>
                ))}

                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">RAM Memory</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.ram}</div>
                ))}

                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">Flash Storage</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.flash}</div>
                ))}

                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">Logic Voltage</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.operatingVoltage}V</div>
                ))}

                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">GPIO Pins</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.gpioCount}</div>
                ))}

                <div className="border-b border-slate-100 dark:border-slate-850 py-2 font-medium text-slate-400">USB Interface</div>
                {compareList.map(b => (
                  <div key={b.id} className="border-b border-slate-100 dark:border-slate-850 py-2 font-mono">{b.usbInterface}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default StepBoardSelector;
