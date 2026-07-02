import React from 'react';

interface HardwareImageProps {
  category: string;
  name: string;
  className?: string;
}

export const HardwareImage: React.FC<HardwareImageProps> = ({ category, name, className = "w-16 h-16" }) => {
  const normalizedCategory = category.toLowerCase();

  // Color schemas based on category
  const getGradient = () => {
    switch (normalizedCategory) {
      case 'boards':
      case 'board':
        return 'from-blue-500/20 to-cyan-500/20 text-blue-500 dark:text-blue-400';
      case 'sensor':
        return 'from-emerald-500/20 to-teal-500/20 text-emerald-500 dark:text-emerald-400';
      case 'display':
        return 'from-indigo-500/20 to-purple-500/20 text-indigo-500 dark:text-indigo-400';
      case 'actuator':
      case 'driver':
        return 'from-orange-500/20 to-amber-500/20 text-orange-500 dark:text-orange-400';
      case 'power':
        return 'from-red-500/20 to-rose-500/20 text-red-500 dark:text-red-400';
      case 'ic':
        return 'from-fuchsia-500/20 to-pink-500/20 text-fuchsia-500 dark:text-fuchsia-400';
      case 'passive':
        return 'from-slate-500/20 to-zinc-500/20 text-slate-500 dark:text-slate-400';
      default:
        return 'from-sky-500/20 to-blue-500/20 text-sky-500 dark:text-sky-400';
    }
  };

  const renderSVGContent = () => {
    switch (normalizedCategory) {
      case 'boards':
      case 'board':
        return (
          // Microcontroller Board illustration
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="8" y="6" width="48" height="52" rx="4" fill="currentColor" fillOpacity="0.05" />
            {/* Header Pins */}
            <path d="M12 12h2m4 0h2m4 0h2m4 0h2m4 0h2m4 0h2" />
            <path d="M12 52h2m4 0h2m4 0h2m4 0h2m4 0h2m4 0h2" />
            {/* MCU Chip */}
            <rect x="22" y="22" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M22 26h-2m2 4h-2m2 4h-2m2 4h-2" />
            <path d="M44 26h-2m2 4h-2m2 4h-2m2 4h-2" />
            {/* USB Connector */}
            <rect x="24" y="2" width="16" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      case 'sensor':
        return (
          // Sensor Module illustration
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="10" y="10" width="44" height="44" rx="4" fill="currentColor" fillOpacity="0.05" />
            {/* Sensor grill element */}
            <rect x="18" y="18" width="28" height="18" rx="2" fill="currentColor" fillOpacity="0.1" />
            <path d="M24 18v18m8-18v18m8-18v18M18 27h28" />
            {/* Output pins */}
            <path d="M26 54v4m6-4v4m6-4v4" />
          </svg>
        );
      case 'display':
        return (
          // Screen / Display Module
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="6" y="12" width="52" height="40" rx="3" fill="currentColor" fillOpacity="0.05" />
            {/* Display screen window */}
            <rect x="12" y="18" width="40" height="24" rx="1" fill="currentColor" fillOpacity="0.1" strokeDasharray="2 1" />
            <path d="M24 26h16M28 32h8" />
            {/* Connection traces */}
            <path d="M20 52v2m6-2v2m6-2v2m6-2v2m6-2v2" />
          </svg>
        );
      case 'actuator':
      case 'driver':
        return (
          // Motor / Driver / Actuator Module
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <circle cx="32" cy="32" r="18" fill="currentColor" fillOpacity="0.05" />
            {/* Motor body details */}
            <circle cx="32" cy="32" r="6" fill="currentColor" fillOpacity="0.2" />
            <path d="M32 14V6M32 50v8M14 32H6M50 32h8" />
            {/* Dynamic rotor shaft */}
            <path d="M28 28l8 8m0-8l-8 8" />
          </svg>
        );
      case 'power':
        return (
          // Power conversion module
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="8" y="12" width="48" height="40" rx="4" fill="currentColor" fillOpacity="0.05" />
            {/* Inductor coil */}
            <circle cx="22" cy="32" r="10" fill="currentColor" fillOpacity="0.1" />
            <path d="M18 32a4 4 0 018 0 4 4 0 018 0" />
            {/* Electrolytic Capacitor */}
            <rect x="38" y="24" width="10" height="16" rx="1" fill="currentColor" fillOpacity="0.2" />
            <path d="M38 28h10m-10 8h10" />
          </svg>
        );
      case 'ic':
        return (
          // Integrated Circuit Chip (DIP package)
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="14" y="8" width="36" height="48" rx="2" fill="currentColor" fillOpacity="0.1" />
            <circle cx="32" cy="14" r="3" fill="currentColor" fillOpacity="0.2" />
            {/* Pins sticking out */}
            <path d="M14 16h-4m4 8h-4m4 8h-4m4 8h-4m4 8h-4" />
            <path d="M50 16h4m-4 8h4m-4 8h4m-4 8h4m-4 8h4" />
          </svg>
        );
      case 'passive':
        return (
          // Passive Component (Resistor schematic symbol)
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            {/* Resistor zig-zag */}
            <path d="M6 32h14l4-8 8 16 8-16 8 16 4-8h16" />
            <circle cx="20" cy="32" r="2" fill="currentColor" />
            <circle cx="44" cy="32" r="2" fill="currentColor" />
          </svg>
        );
      default:
        return (
          // Generic circuit part icon
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="10" y="10" width="44" height="44" rx="6" fill="currentColor" fillOpacity="0.05" />
            <path d="M22 22h20v20H22z" />
            <path d="M32 10v12m0 20v12M10 32h12m20 0h12" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-2 shrink-0 ${getGradient()} ${className}`}>
      {renderSVGContent()}
    </div>
  );
};
export default HardwareImage;
