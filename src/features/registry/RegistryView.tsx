import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { 
  fetchBoards, fetchComponents, fetchManufacturers, 
  fetchProtocols, fetchCategories, fetchUserActivity, 
  toggleBookmark, addRecentlyViewed 
} from '../../services/registry';
import { filterAndSearchRegistry, SearchFilters, SortOption } from '../../utils/searchEngine';
import { BoardSpec, ComponentSpec, Library, Manufacturer, ProtocolSpec } from '../../types';
import { BoardDetailsView } from './BoardDetailsView';
import { ComponentDetailsView } from './ComponentDetailsView';
import { HardwareImage } from '../../components/ui/HardwareImage';
import { 
  Grid, List, Search, SlidersHorizontal, Heart, 
  Clock, Eye, Star, Cpu, BadgeCheck, Loader2 
} from 'lucide-react';

export const RegistryView: React.FC = () => {
  const { user } = useAuth();
  
  // Data lists
  const [registryItems, setRegistryItems] = useState<(BoardSpec | ComponentSpec)[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [protocols, setProtocols] = useState<ProtocolSpec[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  
  // User activity states
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    manufacturerId: 'all',
    protocol: 'all',
    voltage: 'all'
  });
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Fetch baseline catalogs
  useEffect(() => {
    const loadRegistryData = async () => {
      setLoading(true);
      try {
        const boardsData = await fetchBoards();
        const componentsData = await fetchComponents();
        const mfrs = await fetchManufacturers();
        const prots = await fetchProtocols();
        const cats = await fetchCategories();
        const libs = await fetchBoards().then(() => import('../../utils/registrySeedData').then(m => m.allLibraries));

        setRegistryItems([...boardsData, ...componentsData]);
        setManufacturers(mfrs);
        setProtocols(prots);
        setCategories(cats);
        setLibraries(libs);

        if (user) {
          const activity = await fetchUserActivity(user.uid);
          setBookmarks(activity.bookmarks);
          setRecentlyViewed(activity.recentlyViewed);
        }
      } catch (err) {
        setError("Failed to load global hardware registry catalog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRegistryData();
  }, [user]);

  // Handle bookmark trigger
  const handleToggleBookmark = async (itemId: string) => {
    if (!user) return;
    const updated = await toggleBookmark(user.uid, itemId);
    setBookmarks(updated);
  };

  // Handle open item details view
  const handleOpenItem = async (itemId: string) => {
    setSelectedItemId(itemId);
    if (!user) return;
    const updated = await addRecentlyViewed(user.uid, itemId);
    setRecentlyViewed(updated);
  };

  // Filtered & sorted search results
  const displayedItems = filterAndSearchRegistry(registryItems, searchQuery, filters, sortBy);

  // Selected item details resolvers
  const selectedItem = registryItems.find(item => item.id === selectedItemId);
  const selectedItemMfr = manufacturers.find(m => m.id === selectedItem?.manufacturerId)?.name || "Unknown";

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-sm text-slate-500 font-mono">LOADING REGISTRY NODES...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl max-w-lg mx-auto text-center mt-12">
        <h3 className="font-bold">Catalog Fetch Failed</h3>
        <p className="text-xs mt-2">{error}</p>
      </div>
    );
  }

  // --- Render detail view overlays ---
  if (selectedItem) {
    const isFav = bookmarks.includes(selectedItem.id);
    if (!('category' in selectedItem)) {
      // Board Details Layout
      return (
        <BoardDetailsView
          board={selectedItem as BoardSpec}
          manufacturerName={selectedItemMfr}
          compatibleLibs={libraries.filter(l => selectedItem.compatibleLibraries.includes(l.id))}
          onBack={() => setSelectedItemId(null)}
          isFavorite={isFav}
          onToggleFavorite={() => handleToggleBookmark(selectedItem.id)}
        />
      );
    } else {
      // Component Details Layout
      const altNames = registryItems
        .filter(i => selectedItem.alternativeComponents.includes(i.id))
        .map(i => i.name);
      return (
        <ComponentDetailsView
          component={selectedItem as ComponentSpec}
          manufacturerName={selectedItemMfr}
          requiredLibs={libraries.filter(l => selectedItem.requiredLibraries.includes(l.id))}
          onBack={() => setSelectedItemId(null)}
          isFavorite={isFav}
          onToggleFavorite={() => handleToggleBookmark(selectedItem.id)}
          alternativeComponentNames={altNames}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome & Info Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Global Hardware Registry</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          A centralized, fully normalized index of microcontrollers, sensors, communication nodes, and drivers.
        </p>
      </div>

      {/* Control Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Columns: Search, Sorting, and Listing grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Instant Search Bar & Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 w-full md:max-w-md shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Fuzzy search by name, protocol, tags..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none shadow-sm cursor-pointer"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="voltage_asc">Voltage (Low to High)</option>
                <option value="voltage_desc">Voltage (High to Low)</option>
              </select>

              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-1 shadow-sm shrink-0">
                <button 
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'grid' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-350'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setLayoutMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${layoutMode === 'list' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-350'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid List */}
          {displayedItems.length > 0 ? (
            layoutMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedItems.map(item => {
                  const isBoard = !('category' in item);
                  const isFav = bookmarks.includes(item.id);
                  const mfr = manufacturers.find(m => m.id === item.manufacturerId)?.name || "Unknown";

                  return (
                    <div 
                      key={item.id}
                      className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer border-slate-200 dark:border-slate-800 relative group"
                      onClick={() => handleOpenItem(item.id)}
                    >
                      <div>
                        {/* Type Flag & Heart */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide ${
                            isBoard 
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}>
                            {isBoard ? 'BOARD' : (item as ComponentSpec).category.toUpperCase()}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(item.id);
                            }}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isFav 
                                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                : 'border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <HardwareImage 
                          category={isBoard ? 'board' : (item as ComponentSpec).category}
                          name={item.name}
                          className="w-16 h-16 mb-3"
                        />
                        <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-450 dark:text-slate-500 mt-0.5">{mfr}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-800/85 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-500 font-mono">
                        <span>{item.operatingVoltage}V logic</span>
                        <span>{isBoard ? `${(item as BoardSpec).gpioCount} GPIOs` : (item as ComponentSpec).protocol}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl shadow-lg border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800/50">
                {displayedItems.map(item => {
                  const isBoard = !('category' in item);
                  const isFav = bookmarks.includes(item.id);
                  const mfr = manufacturers.find(m => m.id === item.manufacturerId)?.name || "Unknown";

                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleOpenItem(item.id)}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <HardwareImage 
                          category={isBoard ? 'board' : (item as ComponentSpec).category}
                          name={item.name}
                          className="w-12 h-12"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{mfr}</span>
                            <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono capitalize">
                              {isBoard ? 'Board' : (item as ComponentSpec).category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-450 font-mono self-end md:self-auto">
                        <span>{item.operatingVoltage}V</span>
                        <span className="hidden md:inline">{isBoard ? 'N/A' : (item as ComponentSpec).protocol}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(item.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isFav ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="glass-panel border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center max-w-md mx-auto">
              <Cpu className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h4 className="font-bold text-slate-800 dark:text-slate-300">No Hardware Found</h4>
              <p className="text-xs text-slate-500 mt-2">
                No boards or components match your active queries. Try adjusting your search query or catalog category filters.
              </p>
            </div>
          )}

        </div>

        {/* Right Sidebar: Category Sidebar, Filters & Recents */}
        <div className="space-y-6">
          
          {/* Category Sidebar & Filters */}
          <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Catalog Filters</span>
            </h3>
            
            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Category</label>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => setFilters({ ...filters, category: 'all' })}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.category === 'all' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                  All Items
                </button>
                <button 
                  onClick={() => setFilters({ ...filters, category: 'boards' })}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.category === 'boards' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                  Development Boards
                </button>
                {categories.filter(c => c !== 'boards').map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filters.category === cat ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>
            </div>

            {/* Manufacturer Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <label className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Manufacturer</label>
              <select
                value={filters.manufacturerId}
                onChange={e => setFilters({ ...filters, manufacturerId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">All Manufacturers</option>
                {manufacturers.map(mfr => (
                  <option key={mfr.id} value={mfr.id}>{mfr.name}</option>
                ))}
              </select>
            </div>

            {/* Protocol Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <label className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Protocol Bus</label>
              <select
                value={filters.protocol}
                onChange={e => setFilters({ ...filters, protocol: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">All Protocols</option>
                {protocols.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Voltage Toggle */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <label className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 uppercase tracking-wide">Operating Voltage</label>
              <select
                value={filters.voltage}
                onChange={e => setFilters({ ...filters, voltage: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">All Voltages</option>
                <option value="3.3">3.3V Only</option>
                <option value="5.0">5.0V Only</option>
              </select>
            </div>

          </div>

          {/* User Bookmarks Panel */}
          <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Bookmarked Hardware</span>
            </h3>
            <div className="space-y-2">
              {bookmarks.length > 0 ? (
                registryItems
                  .filter(item => bookmarks.includes(item.id))
                  .map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleOpenItem(item.id)}
                      className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                      <HardwareImage 
                        category={'category' in item ? item.category : 'board'}
                        name={item.name}
                        className="w-8 h-8 p-0.5"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-250 truncate">{item.name}</span>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-slate-500">Bookmark items to access them quickly.</p>
              )}
            </div>
          </div>

          {/* User Recently Viewed Panel */}
          <div className="glass-panel rounded-2xl p-5 shadow-lg border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Recently Viewed</span>
            </h3>
            <div className="space-y-2">
              {recentlyViewed.length > 0 ? (
                registryItems
                  .filter(item => recentlyViewed.includes(item.id))
                  .map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleOpenItem(item.id)}
                      className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/40 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                      <HardwareImage 
                        category={'category' in item ? item.category : 'board'}
                        name={item.name}
                        className="w-8 h-8 p-0.5"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-250 truncate">{item.name}</span>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-slate-500">No recently viewed history yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default RegistryView;
