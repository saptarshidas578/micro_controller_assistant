import React, { useState } from 'react';
import { ComponentSpec, ProjectComponent } from '../../types';
import { HardwareImage } from '../../components/ui/HardwareImage';
import { Search, SlidersHorizontal, Plus, Minus, Tag } from 'lucide-react';

interface StepComponentSelectorProps {
  components: ComponentSpec[];
  categories: string[];
  selectedComponents: ProjectComponent[];
  onAddComponent: (componentId: string) => void;
  onRemoveComponent: (componentId: string) => void;
  onUpdateComponentQty: (componentId: string, qty: number) => void;
  onUpdateComponentLabel: (componentId: string, label: string) => void;
}

export const StepComponentSelector: React.FC<StepComponentSelectorProps> = ({
  components,
  categories,
  selectedComponents,
  onAddComponent,
  onRemoveComponent,
  onUpdateComponentQty,
  onUpdateComponentLabel
}) => {
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filteredComponents = components.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || 
                          c.description.toLowerCase().includes(query.toLowerCase());
    const matchesCat = catFilter === 'all' || c.category === catFilter;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Step 3: Component Selection</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Search and include sensors, indicators, actuators, and drivers to attach to your controller layout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Search & Selection List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 w-full shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search registry components..." 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full"
              />
            </div>

            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none shadow-sm cursor-pointer w-full md:w-auto shrink-0"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'boards').map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {filteredComponents.map(comp => {
              const selectedItem = selectedComponents.find(c => c.componentId === comp.id);
              const isSelected = !!selectedItem;

              return (
                <div 
                  key={comp.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between bg-white dark:bg-slate-900 transition-all ${
                    isSelected 
                      ? 'border-blue-500/50 shadow-md ring-1 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <HardwareImage category={comp.category} name={comp.name} className="w-10 h-10" />
                      <span className="text-[9px] font-bold font-mono tracking-wide px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 capitalize">
                        {comp.category}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight">{comp.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{comp.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{comp.operatingVoltage}V ({comp.protocol})</span>
                    {isSelected ? (
                      <button
                        onClick={() => onRemoveComponent(comp.id)}
                        className="px-2.5 py-1 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded font-semibold border border-red-500/20 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddComponent(comp.id)}
                        className="px-2.5 py-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition-colors"
                      >
                        Add to Design
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Project Component Details (custom labels + qty selector) */}
        <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-150">Active Design Elements</h4>
          
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {selectedComponents.length > 0 ? (
              selectedComponents.map(item => {
                const comp = components.find(c => c.id === item.componentId);
                if (!comp) return null;

                return (
                  <div 
                    key={item.instanceId} 
                    className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-xl space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <HardwareImage category={comp.category} name={comp.name} className="w-8 h-8" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate leading-tight">
                          {comp.name}
                        </span>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono block mt-0.5 capitalize">
                          Category: {comp.category}
                        </span>
                      </div>
                    </div>

                    {/* Custom component labeling */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Assign custom label (e.g. Front Sensor)" 
                        value={item.customLabel || ''}
                        onChange={e => onUpdateComponentLabel(comp.id, e.target.value)}
                        className="bg-transparent outline-none w-full text-slate-700 dark:text-slate-300 font-medium"
                      />
                    </div>

                    {/* Qty controller */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-450 dark:text-slate-500 font-medium">Quantity</span>
                      <div className="flex items-center gap-2 border border-slate-250 dark:border-slate-800 rounded bg-white dark:bg-slate-900">
                        <button 
                          onClick={() => onUpdateComponentQty(comp.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateComponentQty(comp.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">Select hardware components from the registry list to attach to your custom layout.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default StepComponentSelector;
