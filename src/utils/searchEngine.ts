import { BoardSpec, ComponentSpec } from '../types';

export interface SearchFilters {
  category: string; // 'all' or specific category
  manufacturerId: string; // 'all' or specific manufacturerId
  protocol: string; // 'all' or specific protocol
  voltage: string; // 'all', '3.3', '5.0'
}

export type SortOption = 'name_asc' | 'name_desc' | 'voltage_asc' | 'voltage_desc';

export const filterAndSearchRegistry = (
  items: (BoardSpec | ComponentSpec)[],
  query: string,
  filters: SearchFilters,
  sortBy: SortOption
): (BoardSpec | ComponentSpec)[] => {
  let filtered = [...items];

  // 1. Search Query Match
  if (query.trim()) {
    const cleanQuery = query.toLowerCase().trim();
    filtered = filtered.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(cleanQuery);
      const descMatch = item.description.toLowerCase().includes(cleanQuery);
      const protocolMatch = 'protocol' in item 
        ? item.protocol.toLowerCase().includes(cleanQuery)
        : item.pins.some(p => p.type.toLowerCase().includes(cleanQuery));
      const tagsMatch = 'tags' in item
        ? item.tags.some(t => t.toLowerCase().includes(cleanQuery))
        : false;

      return nameMatch || descMatch || protocolMatch || tagsMatch;
    });
  }

  // 2. Category Filter
  if (filters.category !== 'all') {
    filtered = filtered.filter(item => {
      if (filters.category === 'boards') {
        return !('category' in item); // Boards don't have component category
      } else {
        return 'category' in item && item.category === filters.category;
      }
    });
  }

  // 3. Manufacturer Filter
  if (filters.manufacturerId !== 'all') {
    filtered = filtered.filter(item => item.manufacturerId === filters.manufacturerId);
  }

  // 4. Protocol Filter
  if (filters.protocol !== 'all') {
    filtered = filtered.filter(item => {
      if ('protocol' in item) {
        return item.protocol.toLowerCase() === filters.protocol.toLowerCase();
      } else {
        // Boards: check if has pin linked with that protocol
        return item.pins.some(p => p.type.toLowerCase() === filters.protocol.toLowerCase());
      }
    });
  }

  // 5. Operating Voltage Filter
  if (filters.voltage !== 'all') {
    const targetVoltage = parseFloat(filters.voltage);
    filtered = filtered.filter(item => item.operatingVoltage === targetVoltage);
  }

  // 6. Sorting Mappings
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'voltage_asc':
        return a.operatingVoltage - b.operatingVoltage;
      case 'voltage_desc':
        return b.operatingVoltage - a.operatingVoltage;
      default:
        return 0;
    }
  });

  return filtered;
};
