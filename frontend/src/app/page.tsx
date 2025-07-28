'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Server, FileText, Table, ChevronDown, ChevronRight, Loader2, AlertCircle, LayoutGrid, Rows, RefreshCw, Clipboard, Search, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react';
import './design-tokens.css';

// API Integration Layer - Single file for all MongoDB operations
type ConnectResponse = { success: boolean; message: string; connectionId?: string };
type Database = { name: string; size?: string; collections?: number };
type Collection = { name: string; count?: number; avgSize?: string };
type Document = { [key: string]: unknown };

// Sorting types
type SortDirection = 'asc' | 'desc' | null;
type SortConfig = { key: string; direction: SortDirection };

// TableView component with sorting and search
interface TableViewProps {
  documents: Document[];
  setCopyToast: (msg: string) => void;
}
const TableView = ({ documents, setCopyToast }: TableViewProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [tableColWidths, setTableColWidths] = useState<number[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null);

  // Update table column widths when documents change
  useEffect(() => {
    if (documents.length > 0) {
      const keys = Object.keys(documents[0]);
      const widths = keys.map(key => {
        // Set reasonable max-widths based on content type
        if (key === '_id') return 200;
        if (key === 'email') return 250;
        if (key === 'passwordHash') return 300;
        if (key === 'roles') return 150;
        if (key === 'tenantId') return 150;
        if (key === '__v') return 80;
        return 180; // default width
      });
      setTableColWidths(widths);
    }
  }, [documents]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useCallback(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm) {
      filtered = documents.filter(doc => {
        return Object.entries(doc).some(([key, value]) => {
          const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return strValue.toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        // Handle different data types
        let aStr = typeof aVal === 'object' ? JSON.stringify(aVal) : String(aVal);
        let bStr = typeof bVal === 'object' ? JSON.stringify(bVal) : String(bVal);
        
        // Try to parse as numbers if possible
        const aNum = parseFloat(aStr);
        const bNum = parseFloat(bStr);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison
        aStr = aStr.toLowerCase();
        bStr = bStr.toLowerCase();
        
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [documents, searchTerm, sortConfig]);

  // Handle column sorting
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { key, direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  // Get sort icon for column
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ChevronDownIcon className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="h-3 w-3 text-blue-600" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="h-3 w-3 text-blue-600" />;
    }
    return <ChevronDownIcon className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
  };

  // Handle cell click for full value display
  const handleCellClick = (rowIndex: number, colKey: string, value: unknown) => {
    const strValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    navigator.clipboard.writeText(strValue);
    setCopyToast('Cell value copied to clipboard!');
    setSelectedCell({ row: rowIndex, col: colKey });
    setTimeout(() => setSelectedCell(null), 2000);
  };

  // Format cell value for display
  const formatCellValue = (value: unknown, maxWidth: number) => {
    const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const isLong = strValue.length > 20;
    const shouldTruncate = maxWidth < 120;
    
    if (shouldTruncate && isLong) {
      return strValue.slice(0, 20) + '…';
    }
    return strValue;
  };

  const processedDocs = filteredAndSortedDocuments();

  if (!documents.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a collection to view documents
      </div>
    );
  }

  const keys = documents.length > 0 ? Object.keys(documents[0]) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search across all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {processedDocs.length} of {documents.length} documents
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-20 bg-gray-50" style={{ width: 36 }}>
                <span className="sr-only">Actions</span>
              </th>
              {keys.map((key, idx) => (
                <th
                  key={key}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                  style={{ 
                    minWidth: 80, 
                    maxWidth: tableColWidths[idx] || 180,
                    width: tableColWidths[idx] || 180
                  }}
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{key}</span>
                    <div className="flex items-center space-x-1">
                      {getSortIcon(key)}
                      <span
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group-hover:bg-blue-100"
                        style={{ zIndex: 10 }}
                        onMouseDown={e => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startWidth = tableColWidths[idx];
                          const onMove = (moveEvent: MouseEvent) => {
                            const delta = moveEvent.clientX - startX;
                            setTableColWidths(w => {
                              const newW = [...w];
                              newW[idx] = Math.max(80, Math.min(600, startWidth + delta));
                              return newW;
                            });
                          };
                          const onUp = () => {
                            document.removeEventListener('mousemove', onMove);
                            document.removeEventListener('mouseup', onUp);
                          };
                          document.addEventListener('mousemove', onMove);
                          document.addEventListener('mouseup', onUp);
                        }}
                      >
                        <div className="w-1 h-6 bg-blue-400 opacity-0 group-hover:opacity-80" style={{ cursor: 'col-resize', marginLeft: '-2px' }} />
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedDocs.length === 0 ? (
              <tr>
                <td colSpan={keys.length + 1} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No documents match your search' : 'No documents found'}
                </td>
              </tr>
            ) : (
              processedDocs.map((doc, index) => (
                <tr key={String(doc._id ?? index)} className="hover:bg-blue-50">
                  <td className="px-2 py-2 sticky left-0 z-10 bg-white">
                    <Tooltip content="Copy row as JSON">
                      <button
                        className="p-0.5 rounded text-gray-500 hover:text-blue-700 hover:bg-blue-100"
                        onClick={e => { 
                          e.stopPropagation(); 
                          navigator.clipboard.writeText(JSON.stringify(doc, null, 2)); 
                          setCopyToast('Copied to clipboard!'); 
                        }}
                        aria-label="Copy row JSON"
                        tabIndex={0}
                      >
                        <Clipboard className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </td>
                  {Object.entries(doc).map(([key, value], cellIndex) => {
                    const colWidth = tableColWidths[cellIndex] || 180;
                    const isSelected = selectedCell?.row === index && selectedCell?.col === key;
                    
                    return (
                      <td
                        key={cellIndex}
                        className={`px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-blue-100 transition-colors ${
                          isSelected ? 'bg-blue-200' : ''
                        }`}
                        style={{ 
                          minWidth: 'max-content', 
                          maxWidth: colWidth,
                          width: colWidth
                        }}
                        onClick={() => handleCellClick(index, key, value)}
                        title={typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      >
                        <div className="truncate">
                          {formatCellValue(value, colWidth)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mongoAPI = {
  // Validate MongoDB connection URI format
  validateConnectionURI: (uri: string): boolean => {
    const mongoRegex = /^mongodb(\+srv)?:\/\/([\w\-\.]+(:[\w\-\.]+)?@)?([\w\-\.]+)(:\d+)?(\/[\w\-\.]*)?(\?[\w\-\.\=\&]*)?$/;
    return mongoRegex.test(uri);
  },

  // Connect to MongoDB
  connect: async (uri: string): Promise<ConnectResponse> => {
    try {
      const res = await fetch('http://localhost:4000/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri })
      });
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, message };
    }
  },

  // Fetch databases
  getDatabases: async (connectionId: string, delayMs = 0): Promise<{ success: boolean; data: Database[]; message?: string }> => {
    await delay(delayMs);
    try {
      const res = await fetch(`http://localhost:4000/databases/${connectionId}`);
      if (!res.ok) {
        const error = await res.json();
        return { success: false, data: [], message: error.error || 'Failed to fetch databases' };
      }
      const dbNames = await res.json();
      const databases = dbNames.map((name: string) => ({ name }));
      return { success: true, data: databases };
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, data: [], message };
    }
  },

  // Fetch collections for a database
  getCollections: async (connectionId: string, dbName: string, delayMs = 0): Promise<{ success: boolean; data: Collection[]; message?: string }> => {
    await delay(delayMs);
    try {
      const res = await fetch(`http://localhost:4000/collections/${connectionId}/${dbName}`);
      if (!res.ok) {
        const error = await res.json();
        return { success: false, data: [], message: error.error || 'Failed to fetch collections' };
      }
      const colNames = await res.json();
      const collections = colNames.map((name: string) => ({ name }));
      return { success: true, data: collections };
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, data: [], message };
    }
  },

  // Fetch documents from a collection
  getDocuments: async (connectionId: string, dbName: string, colName: string, delayMs = 0): Promise<{ success: boolean; data: Document[]; message?: string }> => {
    await delay(delayMs);
    try {
      const res = await fetch(`http://localhost:4000/documents/${connectionId}/${dbName}/${colName}`);
      if (!res.ok) {
        const error = await res.json();
        return { success: false, data: [], message: error.error || 'Failed to fetch documents' };
      }
      const documents = await res.json();
      return { success: true, data: documents };
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, data: [], message };
    }
  },

  // Close connection
  disconnect: async (connectionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`http://localhost:4000/connect/${connectionId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, message };
    }
  }
};

// Utility: delay
function delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }

// Connection form component
interface ConnectionFormProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string;
}
const ConnectionForm = ({ onConnect, isConnecting, error }: ConnectionFormProps) => (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center mb-6">
        <Server className="h-8 w-8 text-green-600 mr-3" />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>MongoDB Explorer</h1>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> This is a read-only demonstration with mock data. 
          Enter any valid MongoDB URI format to explore the interface.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="uri" className="block text-sm font-medium text-gray-700 mb-2">
            MongoDB Connection URI
          </label>
          <input
            type="text"
            id="uri"
            placeholder="mongodb://localhost:27017/mydb"
            defaultValue="mongodb://localhost:27017/mydb"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isConnecting}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: mongodb://localhost:27017/mydb or mongodb+srv://user:pass@cluster.mongodb.net/
          </p>
        </div>
        
        {error && (
          <div className="flex items-center p-3 bg-red-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
        
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </button>
      </div>
    </div>
  </div>
);

// Column component for Finder-style navigation
interface ColumnProps {
  title: string;
  items: any[];
  selectedItem: string;
  onItemSelect: (name: string) => void;
  isLoading: boolean;
  icon?: React.ElementType;
  width?: number; // pass width for conditional truncation
}
const Column = ({ title, items, selectedItem, onItemSelect, isLoading, icon: Icon, width }: ColumnProps) => (
  <div className="flex-1 border-r border-gray-200" style={{ background: 'var(--color-surface)' }}>
    <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3">
      <div className="flex items-center">
        {Icon && <Icon className="h-4 w-4 text-gray-600 mr-2" />}
        <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>{title}</h3>
        <span className="ml-2 text-xs text-gray-500">({items.length})</span>
      </div>
    </div>
    <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="divide-y divide-gray-100" style={{ borderColor: 'var(--color-border)' }}>
          {items.map((item, index) => {
            const content = item.name || item._id || 'Unnamed';
            // Only truncate if width is less than 180px (arbitrary threshold for demo)
            const shouldTruncate = width !== undefined && width < 180;
            return (
              <div
                key={String(index)}
                className={`p-3 cursor-pointer hover:bg-blue-50 ${
                  selectedItem === content ? 'border-r-2 border-blue-500' : ''
                }`}
                style={{ background: selectedItem === content ? 'var(--color-accent-bg)' : undefined }}
                onClick={() => onItemSelect(content)}
              >
                <div
                  className={`font-medium${shouldTruncate ? ' truncate' : ''}`}
                  style={shouldTruncate ? { maxWidth: '12rem', textOverflow: 'ellipsis', overflow: 'hidden' } : {}}
                  title={shouldTruncate ? content : undefined}
                >
                  {content}
                </div>
                {item.size && (
                  <div className="text-xs text-gray-500">
                    {item.size} • {item.collections} collections
                  </div>
                )}
                {item.count !== undefined && (
                  <div className="text-xs text-gray-500">
                    {item.count.toLocaleString()} documents • {item.avgSize}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

// Document views
interface AccordionViewProps {
  documents: Document[];
  setCopyToast: (msg: string) => void;
}
const AccordionView = ({ documents, setCopyToast }: AccordionViewProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(new Set());
  const { widths: mainColWidths } = useResizableWidths([260, 260, 0], [180, 180, 300], [500, 500, 9999]);
  const toggleExpanded = (id: string | number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };
  const handleCopy = (doc: Document) => {
    navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
    setCopyToast('Copied to clipboard!');
  };
  return (
    <div className="space-y-2">
      {documents.map((doc, index) => {
        const id: string | number = typeof doc._id === 'string' ? doc._id : typeof doc._id === 'number' ? doc._id : String(index);
        const isExpanded = expandedItems.has(id);
        const label = typeof id === 'string' ? id.slice(-6) : String(id);
        // Only truncate if mainColWidths[2] is small
        const shouldTruncate = mainColWidths[2] !== undefined && mainColWidths[2] < 180;
        return (
          <div key={String(index)} className="border border-gray-200 rounded-md relative" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => toggleExpanded(id)}
              className="w-full px-4 py-3 text-left flex items-center justify-between cursor-pointer" style={{ background: 'var(--color-surface)' }}
              title={label}
              aria-label={`Toggle document ${label} details`}
            >
              <span className={`font-medium${shouldTruncate ? ' truncate' : ''}`} style={{ color: 'var(--color-text)' }}>
                Document {label}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {isExpanded && (
              <div className="px-4 py-3 bg-white relative">
                <div className="absolute top-2 right-2 z-10">
                  <Tooltip content="Copy JSON">
                    <button
                      className="p-0.5 rounded text-gray-500 hover:text-blue-700" // TODO: theme hover background
                      onClick={() => handleCopy(doc)}
                      aria-label="Copy document JSON"
                      tabIndex={0}
                    >
                      <Clipboard className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </div>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface CardViewProps {
  documents: Document[];
  setCopyToast: (msg: string) => void;
}
const CardView = ({ documents, setCopyToast }: CardViewProps) => {
  const { widths: mainColWidths } = useResizableWidths([260, 260, 0], [180, 180, 300], [500, 500, 9999]);
  const handleCopy = (doc: Document) => {
    navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
    setCopyToast('Copied to clipboard!');
  };
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc, index) => {
        // Only truncate if mainColWidths[2] is small
        const shouldTruncate = mainColWidths[2] !== undefined && mainColWidths[2] < 180;
        return (
          <div key={String(index)} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg cursor-pointer relative" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="absolute top-2 right-2 z-10">
              <Tooltip content="Copy JSON">
                <button
                  className="p-0.5 rounded text-gray-500 hover:text-blue-700" // TODO: theme hover background
                  onClick={() => handleCopy(doc)}
                  aria-label="Copy document JSON"
                  tabIndex={0}
                >
                  <Clipboard className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
            <div className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              {typeof doc._id === 'string' ? `ID: ...${doc._id.slice(-6)}` : typeof doc._id === 'number' ? `ID: ...${doc._id}` : `Document ${index + 1}`}
            </div>
            <div className="space-y-1">
              {Object.entries(doc).slice(0, 4).map(([key, value], entryIndex) => {
                const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                const isLong = strValue.length > 20;
                return (
                  <div key={entryIndex} className={`text-sm${shouldTruncate && isLong ? ' truncate max-w-xs' : ''}`} title={strValue} style={shouldTruncate && isLong ? { maxWidth: '12rem', textOverflow: 'ellipsis', overflow: 'hidden' } : {}}>
                    <span className="font-medium text-gray-600">{key}:</span>{' '}
                    <span style={{ color: 'var(--color-text)' }}>{isLong && shouldTruncate ? strValue.slice(0, 20) + '…' : strValue}</span>
                  </div>
                );
              })}
              {Object.keys(doc).length > 4 && (
                <div className="text-xs text-gray-500 italic">
                  ...and {Object.keys(doc).length - 4} more fields
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Resizable Column Utilities ---
function useResizableWidths(defaults: number[], minWidths: number[] = [], maxWidths: number[] = []) {
  const [widths, setWidths] = useState<number[]>(defaults);
  const startX = React.useRef<number>(0);
  const startWidths = React.useRef<number[]>([]);
  const resizingIndex = React.useRef<number | null>(null);

  const onMouseDown = (e: React.MouseEvent, idx: number) => {
    startX.current = e.clientX;
    startWidths.current = [...widths];
    resizingIndex.current = idx;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (resizingIndex.current === null) return;
    const delta = e.clientX - startX.current;
    const idx = resizingIndex.current;
    const newWidths = [...startWidths.current];
    newWidths[idx] = Math.max(
      minWidths[idx] || 120,
      Math.min((maxWidths[idx] || 600), startWidths.current[idx] + delta)
    );
    setWidths(newWidths);
  };
  const onMouseUp = () => {
    resizingIndex.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  return { widths, onMouseDown };
}

// Toast component (branded for copy, solid color, animated progress bar)
function CopyToast({ message, onClose }: { message: string; onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(3);
  useEffect(() => {
    const tick = () => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
      {message} ({timeLeft}s)
    </div>
  );
}
// --- Prominent Loader and Toast ---
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50">
      {message}
    </div>
  );
}
// Helper: SegmentTabIcon and SegmentTabLabel components
function SegmentTabIcon<T extends string>({ options, value, onChange, className = '', ariaLabel }: { options: { icon: React.ReactNode; value: T; label: string; disabled?: boolean; tooltip?: string }[]; value: T; onChange: (v: T) => void; className?: string; ariaLabel?: string }) {
  return (
    <div className={`inline-flex rounded-md border ${className}`} role="tablist" aria-label={ariaLabel} style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      {options.map(opt => (
        <Tooltip key={opt.value} content={opt.tooltip || opt.label}>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-75 flex items-center justify-center
              ${value === opt.value ? 'text-blue-700 shadow-sm' : opt.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}
              rounded-md first:rounded-l-md last:rounded-r-md border-0`}
            style={{ background: value === opt.value ? 'var(--color-accent-bg)' : undefined }}
            aria-selected={value === opt.value}
            tabIndex={opt.disabled ? -1 : value === opt.value ? 0 : -1}
            onClick={() => !opt.disabled && onChange(opt.value)}
            disabled={opt.disabled}
          >
            {opt.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
function SegmentTabLabel<T extends string>({ options, value, onChange, className = '', ariaLabel, renderButton }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void; className?: string; ariaLabel?: string; renderButton?: (opt: { label: string; value: T }, isSelected: boolean) => React.ReactNode }) {
  return (
    <div className={`inline-flex rounded-md border ${className}`} role="tablist" aria-label={ariaLabel} style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      {options.map(opt => renderButton
        ? renderButton(opt, value === opt.value)
        : (
          <button
            key={opt.value}
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-75
              ${value === opt.value ? 'text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}
              rounded-md first:rounded-l-md last:rounded-r-md border-0`}
            aria-selected={value === opt.value}
            tabIndex={value === opt.value ? 0 : -1}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        )
      )}
    </div>
  );
}
// SkeletonLoader component
function SkeletonLoader({ rows = 5, height = 24, className = '' }: { rows?: number; height?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse rounded" style={{ height, width: '100%', background: 'var(--color-skeleton)' }} />
      ))}
    </div>
  );
}
// --- App component: add loader and toast state ---
const App = () => {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [connectionId, setConnectionId] = useState<string>('');
  const [connectionURI, setConnectionURI] = useState<string>('');

  // Data state
  const [databases, setDatabases] = useState<Database[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  // Loading states
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // UI state
  const [viewMode, setViewMode] = useState<'table' | 'accordion' | 'card'>('table');
  const [layout, setLayout] = useState<'stacked' | 'top-split'>('stacked');
  const [refreshInterval, setRefreshInterval] = useState<number>(0);
  const [copyToast, setCopyToast] = useState<string>('');
  const [toast, setToast] = useState<string>('');
  const [hasMoreDocuments, setHasMoreDocuments] = useState(false);

  // UI Options
  const VIEW_MODE_OPTIONS_ICON = [
    { label: 'Table View', value: 'table', icon: <Table className="h-4 w-4" /> },
    { label: 'Accordion View', value: 'accordion', icon: <ChevronDown className="h-4 w-4" /> },
    { label: 'Card View', value: 'card', icon: <FileText className="h-4 w-4" />, disabled: true, tooltip: 'Card view is not properly implemented yet' },
  ];
  const LAYOUT_OPTIONS_ICON = [
    { label: 'Stacked Layout', value: 'stacked', icon: <Rows className="h-4 w-4" /> },
    { label: 'Top Split Layout', value: 'top-split', icon: <LayoutGrid className="h-4 w-4" />, disabled: true, tooltip: 'Top Split layout is not properly implemented yet' },
  ];
  const REFRESH_OPTIONS_LABEL = [
    { label: 'Off', value: '0' },
    { label: '5s', value: '5000' },
    { label: '10s', value: '10000' },
    { label: '30s', value: '30000' },
    { label: '1 min', value: '60000' },
  ];

  // Layout state
  const [stackedLeftWidth, setStackedLeftWidth] = useState(340); // px, for stacked layout
  const [stackedTopHeight, setStackedTopHeight] = useState(0.4); // percent, for stacked layout (Databases)
  const [topSplitTopHeight, setTopSplitTopHeight] = useState(0.4); // percent, for top-split layout
  const [topSplitLeftWidth, setTopSplitLeftWidth] = useState(0.5); // percent, for top-split layout (Databases)
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [databasesError, setDatabasesError] = useState<string | null>(null);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [simulateDelay, setSimulateDelay] = useState<number>(0); // ms

  // Auto-refresh functionality
  useEffect(() => {
    if (!isConnected || refreshInterval === 0 || !connectionId) return;
    if (!selectedDatabase || !selectedCollection) return;
    const interval = setInterval(async () => {
      // Refresh databases
      const dbResult = await mongoAPI.getDatabases(connectionId, simulateDelay);
      if (dbResult.success) {
        setDatabases(dbResult.data);
      }
      // Refresh documents if a collection is selected
      if (selectedDatabase && selectedCollection) {
        const docResult = await mongoAPI.getDocuments(connectionId, selectedDatabase, selectedCollection, simulateDelay);
        if (docResult.success) {
          setDocuments(docResult.data);
          setHasMoreDocuments(docResult.data.length === 10); // Backend returns max 10 documents
        }
      }
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [isConnected, connectionId, selectedDatabase, selectedCollection, refreshInterval, simulateDelay]);

  const handleManualRefresh = async () => {
    if (!connectionId) return;
    // Refresh databases
    const dbResult = await mongoAPI.getDatabases(connectionId, simulateDelay);
    if (dbResult.success) {
      setDatabases(dbResult.data);
    }
    // Refresh documents if a collection is selected
    if (selectedDatabase && selectedCollection) {
      const docResult = await mongoAPI.getDocuments(connectionId, selectedDatabase, selectedCollection, simulateDelay);
      if (docResult.success) {
        setDocuments(docResult.data);
      }
    }
  };

  // Show loader for all loading states
  useEffect(() => {
    setShowLoader(isLoadingDatabases || isLoadingCollections || isLoadingDocuments || isConnecting);
  }, [isLoadingDatabases, isLoadingCollections, isLoadingDocuments, isConnecting]);

  // Show toast on error
  useEffect(() => {
    if (connectionError) setToast(connectionError);
  }, [connectionError]);

  // Handle connection
  const handleConnect = async () => {
    const input = document.getElementById('uri') as HTMLInputElement | null;
    const uri = input?.value || '';
    if (!uri) return;
    setIsConnecting(true);
    setConnectionError('');
    try {
      const result: ConnectResponse = await mongoAPI.connect(uri);
      if (result.success && result.connectionId) {
        setConnectionURI(uri);
        setConnectionId(result.connectionId);
        setIsConnected(true);
        loadDatabases(result.connectionId);
      } else {
        setConnectionError(result.message);
      }
    } catch (error) {
      setConnectionError('Connection failed. Please check your URI and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Load databases
  const loadDatabases = useCallback(async (connId: string) => {
    setIsLoadingDatabases(true);
    setDatabasesError(null);
    try {
      const result = await mongoAPI.getDatabases(connId, simulateDelay);
      if (result.success) {
        setDatabases(result.data);
      } else {
        setDatabases([]);
        setDatabasesError(result.message || 'Failed to load databases');
      }
    } catch (error) {
      setDatabases([]);
      setDatabasesError((error as Error).message || 'Failed to load databases');
    } finally {
      setIsLoadingDatabases(false);
    }
  }, [simulateDelay]);

  // Handle database selection
  const handleDatabaseSelect = async (dbName: string) => {
    if (!connectionId) return;
    setSelectedDatabase(dbName);
    setSelectedCollection('');
    setCollections([]);
    setDocuments([]);
    setIsLoadingCollections(true);
    setCollectionsError(null);
    try {
      const result = await mongoAPI.getCollections(connectionId, dbName, simulateDelay);
      if (result.success) {
        setCollections(result.data);
      } else {
        setCollections([]);
        setCollectionsError(result.message || 'Failed to load collections');
      }
    } catch (error) {
      setCollections([]);
      setCollectionsError((error as Error).message || 'Failed to load collections');
    } finally {
      setIsLoadingCollections(false);
    }
  };

  // Load documents
  const loadDocuments = useCallback(async (connId: string, db: string, col: string) => {
    setIsLoadingDocuments(true);
    setHasMoreDocuments(true);
    setDocumentsError(null);
    try {
      const result = await mongoAPI.getDocuments(connId, db, col, simulateDelay);
      if (result.success) {
        setDocuments(result.data);
        setHasMoreDocuments(result.data.length === 10); // Backend returns max 10 documents
      } else {
        setDocuments([]);
        setHasMoreDocuments(false);
        setDocumentsError(result.message || 'Failed to load documents');
      }
    } catch (error) {
      setDocuments([]);
      setHasMoreDocuments(false);
      setDocumentsError((error as Error).message || 'Failed to load documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [simulateDelay]);

  // Load more documents (infinite scroll)
  const loadMoreDocuments = async () => {
    if (!hasMoreDocuments || isLoadingMore || !connectionId) return;
    setIsLoadingMore(true);
    setDocumentsError(null);
    try {
      const result = await mongoAPI.getDocuments(connectionId, selectedDatabase, selectedCollection, simulateDelay);
      if (result.success) {
        setDocuments(prev => [...prev, ...result.data]);
        setHasMoreDocuments(result.data.length === 10); // Backend returns max 10 documents
      } else {
        setDocumentsError(result.message || 'Failed to load more documents');
      }
    } catch (error) {
      setDocumentsError((error as Error).message || 'Failed to load more documents');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle collection selection
  const handleCollectionSelect = async (collectionName: string) => {
    if (!connectionId) return;
    setSelectedCollection(collectionName);
    setDocuments([]);
    setDocumentsError(null);
    try {
      const result = await mongoAPI.getDocuments(connectionId, selectedDatabase, collectionName, simulateDelay);
      if (result.success) {
        setDocuments(result.data);
        setHasMoreDocuments(result.data.length === 10); // Backend returns max 10 documents
      } else {
        setDocuments([]);
        setHasMoreDocuments(false);
        setDocumentsError(result.message || 'Failed to load documents');
      }
    } catch (error) {
      setDocuments([]);
      setHasMoreDocuments(false);
      setDocumentsError((error as Error).message || 'Failed to load documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  // Resizable main columns widths
  const { widths: mainColWidths, onMouseDown: onMainColResize } = useResizableWidths([260, 260, 0], [180, 180, 300], [500, 500, 9999]);
  // Table column widths (for TableView)
  const [tableColWidths, setTableColWidths] = useState<number[]>([]);
  // Update tableColWidths when documents change
  useEffect(() => {
    if (documents.length > 0) {
      setTableColWidths(Array(Object.keys(documents[0]).length).fill(180));
    }
  }, [documents]);

  // Render document view based on selected mode
  const renderDocumentView = () => {
    if (!documents.length) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          {selectedCollection ? 'No documents found' : 'Select a collection to view documents'}
        </div>
      );
    }

    switch (viewMode) {
      case 'accordion':
        return <AccordionView documents={documents} setCopyToast={setCopyToast} />;
      case 'card':
        return <CardView documents={documents} setCopyToast={setCopyToast} />;
      default:
        return <TableView documents={documents} setCopyToast={setCopyToast} />;
    }
  };

  // Resizer handlers
  const handleStackedVerticalResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = stackedLeftWidth;
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      setStackedLeftWidth(Math.max(200, Math.min(700, startWidth + delta)));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
  const handleStackedHorizontalResize = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startPercent = stackedTopHeight;
    const container = document.getElementById('stacked-left');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const newPercent = Math.max(0.15, Math.min(0.85, startPercent + delta / containerRect.height));
      setStackedTopHeight(newPercent);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
  const handleTopSplitHorizontalResize = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startPercent = topSplitTopHeight;
    const container = document.getElementById('top-split-main');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const newPercent = Math.max(0.15, Math.min(0.85, startPercent + delta / containerRect.height));
      setTopSplitTopHeight(newPercent);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
  const handleTopSplitVerticalResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startPercent = topSplitLeftWidth;
    const container = document.getElementById('top-split-top');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newPercent = Math.max(0.15, Math.min(0.85, startPercent + delta / containerRect.width));
      setTopSplitLeftWidth(newPercent);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Infinite scroll handler
  const handleDocumentsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (documents.length === 0) return;
    if (hasMoreDocuments && !isLoadingMore && el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      loadMoreDocuments();
    }
  };

  // Theme toggle logic
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  if (!isConnected) {
    return (
      <ConnectionForm
        onConnect={handleConnect}
        isConnecting={isConnecting}
        error={connectionError}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Header */}
      <div className="border-b p-4 flex flex-wrap items-center justify-between gap-4" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-4 min-w-0">
          <Database className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>MongoDB Explorer</h1>
          <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
            READ-ONLY DEMO
          </span>
        </div>
        <div className="flex items-center gap-6 min-w-0">
          <SegmentTabIcon
            options={VIEW_MODE_OPTIONS_ICON}
            value={viewMode}
            onChange={v => setViewMode(v as 'table' | 'accordion' | 'card')}
            ariaLabel="View mode"
          />
          <SegmentTabIcon
            options={LAYOUT_OPTIONS_ICON}
            value={layout}
            onChange={v => setLayout(v as 'stacked' | 'top-split')}
            ariaLabel="Layout"
          />
          <SegmentTabLabel
            options={REFRESH_OPTIONS_LABEL}
            value={String(refreshInterval)}
            onChange={v => setRefreshInterval(Number(v))}
            ariaLabel="Refresh interval"
            renderButton={(opt: { label: string; value: string }, isSelected: boolean) => (
              <Tooltip content={opt.label} key={opt.value} placement="bottom">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-75
                    ${isSelected ? 'text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}
                    rounded-md first:rounded-l-md last:rounded-r-md border-0`}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setRefreshInterval(Number(opt.value))}
                >
                  {opt.label}
                </button>
              </Tooltip>
            )}
          />
          {refreshInterval === 0 && (
            <Tooltip content="Refresh now" placement="bottom">
              <button
                onClick={handleManualRefresh}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm ml-2"
                title="Refresh now"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </Tooltip>
          )}
          <div className="flex items-center gap-2">
            <label htmlFor="simulate-delay" className="text-xs text-gray-500">Simulate Delay:</label>
            <select
              id="simulate-delay"
              className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
              value={simulateDelay}
              onChange={e => setSimulateDelay(Number(e.target.value))}
            >
              <option value={0}>Off</option>
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={3000}>3s</option>
            </select>
          </div>
        </div>
        <button
          id="theme-toggle"
          className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 focus:outline-none ml-auto"
          style={{ background: theme === 'dark' ? 'var(--color-surface)' : 'var(--color-bg)', color: 'var(--color-text)' }}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
      {/* Main content area: layout switch */}
      {layout === 'columns' ? (
        <div className="flex-1 flex overflow-hidden" style={{ minWidth: 600 }}>
          <div style={{ width: mainColWidths[0], minWidth: 120, maxWidth: 500 }}>
            <div style={{ height: '100%', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
              {isLoadingDatabases ? (
                <SkeletonLoader rows={5} height={28} className="mt-4" />
              ) : databasesError ? (
                <div className="flex flex-col items-center justify-center h-full p-8 gap-2" style={{ background: 'var(--color-surface)', color: 'var(--color-danger)' }}>
                  <span className="text-red-600 text-sm font-medium">{databasesError}</span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm" onClick={() => loadDatabases(connectionURI)}>
                    Retry
                  </button>
                </div>
              ) : (
                <Column
                  title="Databases"
                  items={databases}
                  selectedItem={selectedDatabase}
                  onItemSelect={handleDatabaseSelect}
                  isLoading={false}
                  icon={Database}
                  width={mainColWidths[0]}
                />
              )}
            </div>
          </div>
          {/* Resizer between Databases and Collections */}
          <div
            style={{ width: 6, cursor: 'col-resize', background: 'var(--color-border)', zIndex: 20 }}
            onMouseDown={e => onMainColResize(e, 0)}
          />
          <div style={{ width: mainColWidths[1], minWidth: 120, maxWidth: 500 }}>
            <Column
              title="Collections"
              items={collections}
              selectedItem={selectedCollection}
              onItemSelect={handleCollectionSelect}
              isLoading={isLoadingCollections}
              icon={FileText}
              width={mainColWidths[1]}
            />
          </div>
          {/* Resizer between Collections and Documents */}
          <div
            style={{ width: 6, cursor: 'col-resize', background: 'var(--color-border)', zIndex: 20 }}
            onMouseDown={e => onMainColResize(e, 1)}
          />
          {/* Documents column: make entire column scrollable */}
          <div style={{ flex: 1, minWidth: 300, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 z-10 flex items-center justify-between" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Documents</h3>
                <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
              </div>
            </div>
            {/* Make the entire column scrollable, not just the table */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16, color: 'var(--color-text)' }} onScroll={handleDocumentsScroll}>
              {isLoadingDocuments && selectedCollection ? (
                <SkeletonLoader rows={8} height={32} className="mt-4" />
              ) : documentsError ? (
                <div className="flex flex-col items-center justify-center p-8 gap-2" style={{ background: 'var(--color-surface)', color: 'var(--color-danger)' }}>
                  <span className="text-red-600 text-sm font-medium">{documentsError}</span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm" onClick={() => handleCollectionSelect(selectedCollection)}>
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {renderDocumentView()}
                  {isLoadingMore && (
                    <SkeletonLoader rows={2} height={32} className="mt-2" />
                  )}
                  {!hasMoreDocuments && documents.length > 0 && (
                    <div className="text-center text-xs text-gray-400 mt-4" style={{ color: 'var(--color-text)' }}>No more documents.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : layout === 'stacked' ? (
        <div className="flex-1 flex overflow-hidden" style={{ minWidth: 600 }}>
          {/* Left: Databases and Collections stacked, resizable width */}
          <div style={{ width: stackedLeftWidth, minWidth: 200, maxWidth: 700, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg)' }} id="stacked-left">
            <div style={{ flex: `${stackedTopHeight} 1 0%`, minHeight: 0, borderBottom: '1px solid var(--color-border)' }}>
              <Column
                title="Databases"
                items={databases}
                selectedItem={selectedDatabase}
                onItemSelect={handleDatabaseSelect}
                isLoading={isLoadingDatabases}
                icon={Database}
                width={mainColWidths[0]}
              />
            </div>
            {/* Horizontal resizer */}
            <div
              style={{ height: 6, cursor: 'row-resize', background: 'var(--color-border)', zIndex: 20 }}
              onMouseDown={handleStackedHorizontalResize}
            />
            <div style={{ flex: `${1 - stackedTopHeight} 1 0%`, minHeight: 0, background: 'var(--color-bg)' }}>
              <Column
                title="Collections"
                items={collections}
                selectedItem={selectedCollection}
                onItemSelect={handleCollectionSelect}
                isLoading={isLoadingCollections}
                icon={FileText}
                width={mainColWidths[1]}
              />
            </div>
          </div>
          {/* Vertical resizer */}
          <div
            style={{ width: 6, cursor: 'col-resize', background: 'var(--color-border)', zIndex: 20 }}
            onMouseDown={handleStackedVerticalResize}
          />
          {/* Documents: right side, scrollable */}
          <div style={{ flex: 1, minWidth: 300, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 z-10 flex items-center justify-between" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Documents</h3>
                <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16, color: 'var(--color-text)' }} onScroll={handleDocumentsScroll}>
              {isLoadingDocuments ? (
                <SkeletonLoader rows={8} height={32} className="mt-4" />
              ) : (
                <>
                  {renderDocumentView()}
                  {isLoadingMore && (
                    <SkeletonLoader rows={2} height={32} className="mt-2" />
                  )}
                  {!hasMoreDocuments && documents.length > 0 && (
                    <div className="text-center text-xs text-gray-400 mt-4" style={{ color: 'var(--color-text)' }}>No more documents.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Top Split layout
        <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 600, background: 'var(--color-bg)' }} id="top-split-main">
          {/* Top: Databases and Collections side by side, resizable height */}
          <div style={{ flex: `0 0 ${topSplitTopHeight * 100}%`, minHeight: 0, display: 'flex', borderBottom: '1px solid var(--color-border)' }} id="top-split-top">
            <div style={{ width: `${topSplitLeftWidth * 100}%`, minWidth: 120, maxWidth: 700, borderRight: '1px solid var(--color-border)', height: '100%', background: 'var(--color-bg)' }}>
              <Column
                title="Databases"
                items={databases}
                selectedItem={selectedDatabase}
                onItemSelect={handleDatabaseSelect}
                isLoading={isLoadingDatabases}
                icon={Database}
                width={mainColWidths[0]}
              />
            </div>
            {/* Vertical resizer */}
            <div
              style={{ width: 6, cursor: 'col-resize', background: 'var(--color-border)', zIndex: 20 }}
              onMouseDown={handleTopSplitVerticalResize}
            />
            <div style={{ width: `${(1 - topSplitLeftWidth) * 100}%`, minWidth: 120, maxWidth: 700, height: '100%', background: 'var(--color-bg)' }}>
              <Column
                title="Collections"
                items={collections}
                selectedItem={selectedCollection}
                onItemSelect={handleCollectionSelect}
                isLoading={isLoadingCollections}
                icon={FileText}
                width={mainColWidths[1]}
              />
            </div>
          </div>
          {/* Horizontal resizer */}
          <div
            style={{ height: 6, cursor: 'row-resize', background: 'var(--color-border)', zIndex: 20 }}
            onMouseDown={handleTopSplitHorizontalResize}
          />
          {/* Bottom: Documents column, fully scrollable */}
          <div style={{ flex: '1 1 60%', minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 z-10 flex items-center justify-between" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>Documents</h3>
                <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16, color: 'var(--color-text)' }} onScroll={handleDocumentsScroll}>
              {isLoadingDocuments ? (
                <SkeletonLoader rows={8} height={32} className="mt-4" />
              ) : (
                <>
                  {renderDocumentView()}
                  {isLoadingMore && (
                    <SkeletonLoader rows={2} height={32} className="mt-2" />
                  )}
                  {!hasMoreDocuments && documents.length > 0 && (
                    <div className="text-center text-xs text-gray-400 mt-4" style={{ color: 'var(--color-text)' }}>No more documents.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      {copyToast && <CopyToast message={copyToast} onClose={() => setCopyToast('')} />}
    </div>
  );
};

// Tooltip component with placement
function Tooltip({ children, content, placement = 'top' }: { children: React.ReactNode; content: string; placement?: 'top' | 'bottom' }) {
  const [show, setShow] = useState(false);
  let timeout: NodeJS.Timeout;
  const handleEnter = () => { timeout = setTimeout(() => setShow(true), 200); };
  const handleLeave = () => { clearTimeout(timeout); setShow(false); };
  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={-1}
    >
      {children}
      {show && (
        <span className={`absolute z-50 left-1/2 -translate-x-1/2 ${placement === 'top' ? 'mt-2' : 'mb-2'} text-xs rounded shadow-lg whitespace-nowrap pointer-events-none ${placement === 'top' ? '' : 'top-full'}`}
          style={{
            background: 'var(--color-tooltip-bg)',
            color: 'var(--color-tooltip-text)',
            padding: '0.25rem 0.5rem',
            ...(placement === 'bottom' ? { top: '100%' } : { bottom: '100%' })
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default App;