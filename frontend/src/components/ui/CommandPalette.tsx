import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, FileText, Package, Users, TrendingUp, Settings, Upload, Download } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'equipment' | 'client' | 'certificate' | 'page';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - Replace with actual search API
  const allItems: SearchResult[] = [
    // Equipment
    { id: 'eq1', type: 'equipment', title: 'Digital Multimeter DMM-2500', subtitle: 'ABC Manufacturing • Due: Jan 17, 2026', icon: <Package className="h-4 w-4" />, action: () => console.log('Navigate to DMM-2500') },
    { id: 'eq2', type: 'equipment', title: 'Pressure Gauge PG-1000', subtitle: 'XYZ Industries • Due: Nov 16, 2025', icon: <Package className="h-4 w-4" />, action: () => console.log('Navigate to PG-1000') },
    { id: 'eq3', type: 'equipment', title: 'Temperature Sensor TS-550', subtitle: 'Tech Corp • Due: Apr 15, 2026', icon: <Package className="h-4 w-4" />, action: () => console.log('Navigate to TS-550') },
    
    // Clients
    { id: 'cl1', type: 'client', title: 'ABC Manufacturing', subtitle: '15 equipment items • Last calibration: Oct 17', icon: <Users className="h-4 w-4" />, action: () => console.log('Navigate to ABC Manufacturing') },
    { id: 'cl2', type: 'client', title: 'XYZ Industries', subtitle: '8 equipment items • Last calibration: Oct 16', icon: <Users className="h-4 w-4" />, action: () => console.log('Navigate to XYZ Industries') },
    { id: 'cl3', type: 'client', title: 'Tech Corp', subtitle: '22 equipment items • Last calibration: Oct 15', icon: <Users className="h-4 w-4" />, action: () => console.log('Navigate to Tech Corp') },
    
    // Certificates
    { id: 'cert1', type: 'certificate', title: 'CERT-2025-001', subtitle: 'DMM-2500 • ABC Manufacturing • Oct 17, 2025', icon: <FileText className="h-4 w-4" />, action: () => console.log('Open CERT-2025-001') },
    { id: 'cert2', type: 'certificate', title: 'CERT-2025-002', subtitle: 'PG-1000 • XYZ Industries • Oct 16, 2025', icon: <FileText className="h-4 w-4" />, action: () => console.log('Open CERT-2025-002') },
    
    // Pages
    { id: 'p1', type: 'page', title: 'Analytics Dashboard', subtitle: 'View charts and statistics', icon: <TrendingUp className="h-4 w-4" />, action: () => console.log('Navigate to Analytics') },
    { id: 'p2', type: 'page', title: 'Equipment Management', subtitle: 'Manage all equipment', icon: <Package className="h-4 w-4" />, action: () => console.log('Navigate to Equipment') },
    { id: 'p3', type: 'page', title: 'Client Management', subtitle: 'Manage clients and contacts', icon: <Users className="h-4 w-4" />, action: () => console.log('Navigate to Clients') },
    { id: 'p4', type: 'page', title: 'Settings', subtitle: 'System configuration', icon: <Settings className="h-4 w-4" />, action: () => console.log('Navigate to Settings') },
    { id: 'p5', type: 'page', title: 'Import Data', subtitle: 'Import equipment or calibration data', icon: <Upload className="h-4 w-4" />, action: () => console.log('Navigate to Import') },
    { id: 'p6', type: 'page', title: 'Export Reports', subtitle: 'Generate and download reports', icon: <Download className="h-4 w-4" />, action: () => console.log('Navigate to Export') },
  ];

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Show recent/popular items when no query
      setResults(allItems.slice(0, 6));
    } else {
      const filtered = allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    }
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            results[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'equipment': return 'bg-blue-100 text-blue-700';
      case 'client': return 'bg-purple-100 text-purple-700';
      case 'certificate': return 'bg-green-100 text-green-700';
      case 'page': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-slide-in-from-top">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search equipment, clients, certificates, or pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={onClose}
              className="ml-3 p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found</p>
                <p className="text-sm mt-1">Try searching for equipment, clients, or certificates</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      result.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                      index === selectedIndex
                        ? 'bg-indigo-50 border-l-2 border-indigo-500'
                        : 'hover:bg-gray-50 border-l-2 border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded ${
                      index === selectedIndex ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      {result.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-500">{result.subtitle}</div>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadgeColor(result.type)}`}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                Close
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recent searches
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
