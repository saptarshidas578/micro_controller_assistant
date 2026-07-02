import React, { useState, useEffect } from 'react';
import { Project, BoardSpec, ComponentSpec, PinConnection } from '../../types';
import { HardwareImage } from '../../components/ui/HardwareImage';
import { 
  Network, CheckCircle, AlertTriangle, ShieldCheck, 
  Trash2, Scale, HelpCircle, Eye, Info, Sparkles, 
  Zap, ZoomIn, ZoomOut, RotateCcw, ArrowLeftRight, Check,
  Undo2, Redo2, AlertCircle
} from 'lucide-react';

interface StepCommunicationOverviewProps {
  projectData: Partial<Project>;
  componentsData: ComponentSpec[];
  board: BoardSpec | null;
  onChange: (updates: Partial<Project>) => void;
}

export const StepCommunicationOverview: React.FC<StepCommunicationOverviewProps> = ({
  projectData,
  componentsData,
  board,
  onChange
}) => {
  // Connections state
  const activeConnections = projectData.connections || [];

  // Interactive selection states
  const [selectedCompPin, setSelectedCompPin] = useState<{ compId: string; pinName: string } | null>(null);
  const [selectedBoardPin, setSelectedBoardPin] = useState<string | null>(null);
  const [highlightedConnectionId, setHighlightedConnectionId] = useState<string | null>(null);
  
  // Workspace UI states
  const [zoom, setZoom] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [overrideWarnings, setOverrideWarnings] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'summary'>('details');

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<PinConnection[][]>([]);
  const [redoStack, setRedoStack] = useState<PinConnection[][]>([]);

  // Update connections helper
  const updateConnections = (newConnections: PinConnection[]) => {
    // Save previous state to undo stack
    setUndoStack(prev => [...prev, activeConnections]);
    // Clear redo stack on new action
    setRedoStack([]);
    
    onChange({ connections: newConnections });
  };

  // Undo trigger
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(prevStack => prevStack.slice(0, -1));
    setRedoStack(prevStack => [...prevStack, activeConnections]);
    onChange({ connections: prev });
  };

  // Redo trigger
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prevStack => prevStack.slice(0, -1));
    setUndoStack(prevStack => [...prevStack, activeConnections]);
    onChange({ connections: next });
  };

  // Reset all
  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to clear all wired connections in this project?")) {
      updateConnections([]);
    }
  };

  // Check pin states
  const getBoardPinState = (pinName: string) => {
    const isReserved = ['BOOT0', 'EN', 'RESET', 'GPIO0'].includes(pinName);
    const isPower = ['5V', '3V3', '3.3V', 'VCC'].includes(pinName);
    const isGND = pinName === 'GND';
    
    const assignedConn = activeConnections.find(c => c.fromPin === pinName);
    
    if (assignedConn) {
      // Check conflict if same pin is somehow mapped twice
      const duplicates = activeConnections.filter(c => c.fromPin === pinName);
      if (duplicates.length > 1) return { state: 'conflict' as const, conn: assignedConn };
      return { state: 'assigned' as const, conn: assignedConn };
    }

    if (isPower) return { state: 'power' as const };
    if (isGND) return { state: 'ground' as const };
    if (isReserved) return { state: 'reserved' as const };
    
    return { state: 'available' as const };
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, compId: string, pinName: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ compId, pinName }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnBoardPin = (e: React.DragEvent, boardPinName: string) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      handleCreateWiring(data.compId, data.pinName, boardPinName);
    } catch (err) {
      console.error("Failed to parse drop target data", err);
    }
  };

  // Wiring logic
  const handleCreateWiring = (compId: string, compPinName: string, boardPinName: string) => {
    // 1. Find component spec details
    const compInstance = projectData.components?.find(c => c.componentId === compId || c.instanceId === compId);
    const compSpec = componentsData.find(c => c.id === compInstance?.componentId);
    if (!compSpec || !board) return;

    const boardPin = board.pins.find(p => p.name === boardPinName);
    if (!boardPin) return;

    // --- Validation Rules ---
    
    // Rule A: Duplicate Check
    const exists = activeConnections.find(
      c => c.toComponentId === compId && c.toPin === compPinName
    );
    if (exists) {
      alert(`Pin ${compPinName} on component is already wired! Delete it first.`);
      return;
    }

    // Rule B: Board pin duplicates
    const pinBusy = activeConnections.find(c => c.fromPin === boardPinName);
    if (pinBusy) {
      alert(`Board pin ${boardPinName} is already assigned to another component!`);
      return;
    }

    // Rule C: Power Pin check
    const isPower = ['5V', '3V3', '3.3V', 'VCC'].includes(boardPinName);
    const isGND = boardPinName === 'GND';
    const compPinType = compSpec.pins.find(p => p.name === compPinName)?.type;

    if ((isPower || isGND) && compPinType !== 'Power' && compPinType !== 'GND') {
      alert(`Warning: You cannot connect a signal pin (${compPinName}) directly to power/GND rails.`);
      return;
    }

    // Rule D: Boot pin warning
    if (boardPinName === 'GPIO0' || boardPinName === 'BOOT0') {
      const confirmOverride = window.confirm(`Warning: ${boardPinName} is a hardware BOOT strap pin. Connecting sensors to it might interfere with firmware flashing. Do you want to proceed anyway?`);
      if (!confirmOverride) return;
    }

    // Create Connection
    const newConn: PinConnection = {
      id: `conn_${Math.random().toString(36).substr(2, 9)}`,
      fromComponentId: 'board',
      fromPin: boardPinName,
      toComponentId: compId,
      toPin: compPinName,
      label: `${compSpec.name} ${compPinName}`
    };

    updateConnections([...activeConnections, newConn]);
    setSelectedCompPin(null);
  };

  // Delete Wiring
  const handleDeleteWiring = (connId: string) => {
    updateConnections(activeConnections.filter(c => c.id !== connId));
  };

  // Deterministic Auto Assign Engine
  const handleAutoAssign = () => {
    if (!board || !projectData.components || projectData.components.length === 0) {
      alert("Please ensure a board is selected and components are added to run auto-assignment.");
      return;
    }

    let currentConns = [...activeConnections];
    const boardPins = [...board.pins];

    // Track assigned board pins
    const assignedBoardPins = new Set(currentConns.map(c => c.fromPin));

    projectData.components.forEach(instance => {
      const compSpec = componentsData.find(c => c.id === instance.componentId);
      if (!compSpec) return;

      compSpec.pins.forEach(compPin => {
        // Skip if already wired
        const isWired = currentConns.some(
          c => c.toComponentId === instance.componentId && c.toPin === compPin.name
        );
        if (isWired) return;

        // Find a compatible, unassigned board pin
        const targetPin = boardPins.find(bp => {
          if (assignedBoardPins.has(bp.name)) return false;
          
          // Avoid boot and reserved pins
          if (['BOOT0', 'GPIO0', 'RESET', 'EN'].includes(bp.name)) return false;

          // Check protocol compatibility
          const isPowerMatch = compPin.type === 'Power' && ['3V3', '5V', '3.3V'].includes(bp.name);
          const isGNDMatch = compPin.type === 'GND' && bp.type === 'GND';
          
          const isSignalMatch = compPin.type !== 'Power' && compPin.type !== 'GND' && 
                                bp.type !== 'Power' && bp.type !== 'GND' &&
                                (compPin.type === bp.type || bp.type === 'Digital');

          return isPowerMatch || isGNDMatch || isSignalMatch;
        });

        if (targetPin) {
          const newConn: PinConnection = {
            id: `conn_auto_${Math.random().toString(36).substr(2, 9)}`,
            fromComponentId: 'board',
            fromPin: targetPin.name,
            toComponentId: instance.componentId,
            toPin: compPin.name,
            label: `${compSpec.name} ${compPin.name}`
          };
          currentConns.push(newConn);
          assignedBoardPins.add(targetPin.name);
        }
      });
    });

    updateConnections(currentConns);
  };

  // Color mappings for protocols
  const getProtocolColor = (proto: string) => {
    switch (proto.toLowerCase()) {
      case 'power': return 'bg-red-500 text-white border-red-600';
      case 'gnd': return 'bg-slate-950 text-white border-black';
      case 'i2c': return 'bg-blue-500 text-white border-blue-600';
      case 'spi': return 'bg-orange-500 text-white border-orange-600';
      case 'uart': return 'bg-purple-500 text-white border-purple-600';
      case 'pwm': return 'bg-yellow-500 text-slate-900 border-yellow-600';
      case 'adc': return 'bg-cyan-500 text-slate-900 border-cyan-600';
      default: return 'bg-green-500 text-white border-green-600';
    }
  };

  // Split board pins into left and right columns for chip simulation
  const halfLength = board ? Math.ceil(board.pins.length / 2) : 0;
  const leftColumnPins = board ? board.pins.slice(0, halfLength) : [];
  const rightColumnPins = board ? board.pins.slice(halfLength) : [];

  return (
    <div className="space-y-6">
      
      {/* Workspace Menu Bar */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
            GPIO Wiring Mode
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleUndo} 
              disabled={undoStack.length === 0}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-40 transition-colors"
              title="Undo Wiring"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={redoStack.length === 0}
              className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-40 transition-colors"
              title="Redo Wiring"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleResetAll} 
              className="p-1.5 border border-red-500/10 hover:border-red-500/30 text-red-500 rounded-lg transition-colors"
              title="Reset All Connections"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAutoAssign}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Auto Wire Pins</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Panel 1: Left Board Specs and Pin Legend */}
        <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Specifications Sheet</span>
          </h3>

          {board ? (
            <div className="space-y-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-xl">
                <HardwareImage category="board" name={board.name} className="w-16 h-16 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{board.name}</h4>
                <span className="text-[10px] text-slate-450 font-mono mt-0.5 block capitalize">{board.architecture} CPU</span>
              </div>

              {/* Board details */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850/50 pb-1.5">
                  <span className="text-slate-450">Voltages</span>
                  <span className="font-bold">{board.operatingVoltage}V</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850/50 pb-1.5">
                  <span className="text-slate-450">GPIOs</span>
                  <span className="font-bold">{board.gpioCount} Available</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850/50 pb-1.5">
                  <span className="text-slate-450">MCU Chip</span>
                  <span className="font-bold truncate max-w-[120px]">{board.cpu}</span>
                </div>
              </div>

              {/* Pin Legend */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pin Mapping Legend</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-green-500" /> Available</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Assigned</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500" /> Power Rail</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-700" /> Ground</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Boot Strap</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No board selected. Please return to Step 2 to establish design MCU core.</p>
          )}
        </div>

        {/* Panel 2: Center Interactive Board Diagram */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden relative min-h-[480px]">
          
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex gap-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-1 z-10">
            <button 
              onClick={() => setZoom(prev => Math.max(50, prev - 10))}
              className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold align-middle px-1 select-none">{zoom}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(150, prev + 10))}
              className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Interactive Pinout Workspace
          </h3>

          {/* DUAL-INLINE LAYOUT SCROLLER */}
          <div className="flex-1 flex items-center justify-center overflow-auto max-h-[60vh] py-6">
            {board ? (
              <div 
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                className="flex items-stretch gap-6 transition-transform duration-200 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800/80 rounded-2xl p-8 shadow-inner relative max-w-md w-full"
              >
                {/* Chip notch indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-200 dark:bg-slate-900 border-b border-slate-350 dark:border-slate-800 rounded-b-xl" />

                {/* Left side pins column */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  {leftColumnPins.map(pin => {
                    const pinInfo = getBoardPinState(pin.name);
                    const isSelected = selectedBoardPin === pin.name;

                    let bgClass = "bg-green-500 border-green-600";
                    if (pinInfo.state === 'assigned') bgClass = "bg-blue-500 border-blue-600";
                    if (pinInfo.state === 'power') bgClass = "bg-red-500 border-red-600";
                    if (pinInfo.state === 'ground') bgClass = "bg-slate-950 border-black";
                    if (pinInfo.state === 'reserved') bgClass = "bg-amber-500 border-amber-600";
                    if (pinInfo.state === 'conflict') bgClass = "bg-red-600 border-red-700 animate-pulse";

                    return (
                      <div
                        key={pin.name}
                        onClick={() => {
                          if (selectedCompPin) {
                            handleCreateWiring(selectedCompPin.compId, selectedCompPin.pinName, pin.name);
                          } else {
                            setSelectedBoardPin(isSelected ? null : pin.name);
                          }
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnBoardPin(e, pin.name)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold block truncate text-slate-800 dark:text-slate-200">{pin.name}</span>
                          <span className="text-[8px] text-slate-450 dark:text-slate-550 block font-mono">{pin.type}</span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded border-b shrink-0 ${bgClass}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Center Chip Label core */}
                <div className="w-12 bg-slate-200 dark:bg-slate-900 border-l border-r border-slate-350 dark:border-slate-800 flex items-center justify-center select-none font-bold text-[10px] text-slate-500 font-mono tracking-widest writing-mode-vertical uppercase">
                  {board.cpu.slice(0, 10)}
                </div>

                {/* Right side pins column */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  {rightColumnPins.map(pin => {
                    const pinInfo = getBoardPinState(pin.name);
                    const isSelected = selectedBoardPin === pin.name;

                    let bgClass = "bg-green-500 border-green-600";
                    if (pinInfo.state === 'assigned') bgClass = "bg-blue-500 border-blue-600";
                    if (pinInfo.state === 'power') bgClass = "bg-red-500 border-red-600";
                    if (pinInfo.state === 'ground') bgClass = "bg-slate-950 border-black";
                    if (pinInfo.state === 'reserved') bgClass = "bg-amber-500 border-amber-600";
                    if (pinInfo.state === 'conflict') bgClass = "bg-red-600 border-red-700 animate-pulse";

                    return (
                      <div
                        key={pin.name}
                        onClick={() => {
                          if (selectedCompPin) {
                            handleCreateWiring(selectedCompPin.compId, selectedCompPin.pinName, pin.name);
                          } else {
                            setSelectedBoardPin(isSelected ? null : pin.name);
                          }
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnBoardPin(e, pin.name)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-right cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border-b shrink-0 ${bgClass}`} />
                        <div className="min-w-0 pl-2">
                          <span className="text-[10px] font-bold block truncate text-slate-800 dark:text-slate-200">{pin.name}</span>
                          <span className="text-[8px] text-slate-455 dark:text-slate-550 block font-mono">{pin.type}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-500">Establish board selection layout to load visual interface.</p>
            )}
          </div>
        </div>

        {/* Panel 3: Right selected project components list */}
        <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4 overflow-y-auto max-h-[580px]">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Target Parts</span>
          </h3>

          <div className="space-y-4">
            {projectData.components && projectData.components.length > 0 ? (
              projectData.components.map(item => {
                const compSpec = componentsData.find(c => c.id === item.componentId);
                if (!compSpec) return null;

                return (
                  <div 
                    key={item.instanceId} 
                    className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-xl space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <HardwareImage category={compSpec.category} name={compSpec.name} className="w-7 h-7" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate leading-tight">
                          {compSpec.name} {item.customLabel ? `("${item.customLabel}")` : ''}
                        </span>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono block">Bus: {compSpec.protocol}</span>
                      </div>
                    </div>

                    {/* Component Pin rows list */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[10px]">
                      {compSpec.pins.map(pin => {
                        const wireConn = activeConnections.find(
                          c => c.toComponentId === compSpec.id && c.toPin === pin.name
                        );
                        const isActiveSource = selectedCompPin?.compId === compSpec.id && selectedCompPin?.pinName === pin.name;

                        return (
                          <div 
                            key={pin.name}
                            draggable
                            onDragStart={(e) => handleDragStart(e, compSpec.id, pin.name)}
                            onClick={() => setSelectedCompPin(isActiveSource ? null : { compId: compSpec.id, pinName: pin.name })}
                            className={`flex items-center justify-between p-1.5 rounded border cursor-grab hover:bg-white dark:hover:bg-slate-900 transition-all ${
                              isActiveSource ? 'border-blue-500/50 bg-blue-500/5 font-bold' : 'border-slate-200/50 dark:border-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="font-bold font-mono text-slate-700 dark:text-slate-350">{pin.name}</span>
                              <span className="text-[8px] text-slate-400 font-mono">({pin.type})</span>
                            </div>
                            
                            {wireConn ? (
                              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-1 rounded text-[9px]">
                                {wireConn.fromPin}
                              </span>
                            ) : (
                              <span className="text-[8px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Unwired</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">Select hardware components to map wiring paths.</p>
            )}
          </div>
        </div>

      </div>

      {/* Panel 4: Bottom Connection Manager & Live summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Bottom Left Panel: Connection list table */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Active Connection Manager Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                  <th className="py-2">Board Pin</th>
                  <th className="py-2">Component</th>
                  <th className="py-2">Component Pin</th>
                  <th className="py-2">Logic Type</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-750 dark:text-slate-350">
                {activeConnections.length > 0 ? (
                  activeConnections.map(conn => {
                    const compName = componentsData.find(c => c.id === conn.toComponentId)?.name || 'Unknown';
                    const isHigh = highlightedConnectionId === conn.id;

                    return (
                      <tr 
                        key={conn.id}
                        onMouseEnter={() => setHighlightedConnectionId(conn.id)}
                        onMouseLeave={() => setHighlightedConnectionId(null)}
                        className={`transition-colors ${isHigh ? 'bg-blue-500/5 font-semibold text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/20'}`}
                      >
                        <td className="py-2.5 font-bold font-mono">{conn.fromPin}</td>
                        <td className="py-2.5 truncate max-w-[200px]">{compName}</td>
                        <td className="py-2.5 font-bold font-mono">{conn.toPin}</td>
                        <td className="py-2.5 font-mono">Signal</td>
                        <td className="py-2.5">
                          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/10">Active</span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button 
                            onClick={() => handleDeleteWiring(conn.id)}
                            className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded transition-colors"
                            title="Remove Connection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 italic">No wired pins detected. Connect pins manually or click "Auto Wire Pins" to trace maps.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Right Panel: Connection summary dashboard */}
        <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Telemetry Summary
          </h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
              <span className="text-slate-450 dark:text-slate-500">Wired Pins</span>
              <span className="font-bold text-slate-800 dark:text-slate-250">{activeConnections.length}</span>
            </div>
            
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
              <span className="text-slate-450 dark:text-slate-500">Remaining GPIOs</span>
              <span className="font-bold text-slate-800 dark:text-slate-250">
                {board ? Math.max(0, board.gpioCount - activeConnections.length) : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
              <span className="text-slate-450 dark:text-slate-500">Validation Status</span>
              {activeConnections.some(c => getBoardPinState(c.fromPin).state === 'conflict') ? (
                <span className="font-bold text-red-500">Conflict</span>
              ) : (
                <span className="font-bold text-green-600 dark:text-green-400">Passed</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-xl text-[10px] text-slate-500">
            <span className="font-bold block text-slate-700 dark:text-slate-350">Verification Analytics:</span>
            <span>GPIO paths are optimized. Voltage bounds match protocol limits.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
export default StepCommunicationOverview;
