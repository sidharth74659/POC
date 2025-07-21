'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Server, FileText, Table, ChevronDown, ChevronRight, Loader2, AlertCircle, LayoutGrid, Rows, Columns, RefreshCw, Clipboard } from 'lucide-react';

// API Integration Layer - Single file for all MongoDB operations
type ConnectResponse = { success: boolean; message: string };
type Database = { name: string; size?: string; collections?: number };
type Collection = { name: string; count?: number; avgSize?: string };
type Document = { [key: string]: unknown };

const mongoAPI = {
  // Mock data - replace with actual API calls to backend server
  mockDatabases: [
    { name: 'ecommerce', size: '2.1 GB', collections: 12 },
    { name: 'analytics', size: '845 MB', collections: 8 },
    { name: 'users', size: '156 MB', collections: 4 },
    { name: 'inventory', size: '3.2 GB', collections: 15 },
    { name: 'logs', size: '12.8 GB', collections: 3 }
  ],

  mockCollections: {
    ecommerce: [
      { name: 'products', count: 15420, avgSize: '2.1 KB' },
      { name: 'orders', count: 8932, avgSize: '3.4 KB' },
      { name: 'customers', count: 5617, avgSize: '1.8 KB' },
      { name: 'reviews', count: 23156, avgSize: '0.9 KB' },
      { name: 'categories', count: 145, avgSize: '0.5 KB' }
    ],
    analytics: [
      { name: 'events', count: 125000, avgSize: '0.8 KB' },
      { name: 'sessions', count: 45000, avgSize: '1.2 KB' },
      { name: 'pageviews', count: 890000, avgSize: '0.3 KB' }
    ],
    users: [
      { name: 'profiles', count: 8500, avgSize: '2.1 KB' },
      { name: 'preferences', count: 8200, avgSize: '0.7 KB' }
    ],
    inventory: [
      { name: 'items', count: 25000, avgSize: '1.5 KB' },
      { name: 'warehouses', count: 12, avgSize: '5.2 KB' },
      { name: 'suppliers', count: 340, avgSize: '2.8 KB' }
    ],
    logs: [
      { name: 'application', count: 2500000, avgSize: '0.4 KB' },
      { name: 'errors', count: 15000, avgSize: '1.1 KB' }
    ]
  } as Record<string, Collection[]>,

  mockDocuments: {
    'ecommerce.products': [
      { _id: '507f1f77bcf86cd799439011', name: 'Wireless Headphones', price: 299.99, category: 'Electronics', inStock: true },
      { _id: '507f1f77bcf86cd799439012', name: 'Coffee Maker', price: 149.99, category: 'Appliances', inStock: false },
      { _id: '507f1f77bcf86cd799439013', name: 'Running Shoes', price: 89.99, category: 'Sports', inStock: true },
      { _id: '507f1f77bcf86cd799439014', name: 'Desk Lamp', price: 45.99, category: 'Furniture', inStock: true },
      { _id: '507f1f77bcf86cd799439015', name: 'Smartphone Case', price: 24.99, category: 'Accessories', inStock: true }
    ],
    'ecommerce.orders': [
      { _id: '507f1f77bcf86cd799439021', orderId: 'ORD-2024-001', customerId: 'CUST-456', total: 299.99, status: 'shipped' },
      { _id: '507f1f77bcf86cd799439022', orderId: 'ORD-2024-002', customerId: 'CUST-789', total: 174.98, status: 'processing' },
      { _id: '507f1f77bcf86cd799439023', orderId: 'ORD-2024-003', customerId: 'CUST-123', total: 89.99, status: 'delivered' }
    ],
    'analytics.events': [
      { _id: '507f1f77bcf86cd799439031', event: 'page_view', userId: 'user123', timestamp: '2024-01-15T10:30:00Z', page: '/products' },
      { _id: '507f1f77bcf86cd799439032', event: 'button_click', userId: 'user456', timestamp: '2024-01-15T10:31:15Z', element: 'add-to-cart' },
      { _id: '507f1f77bcf86cd799439033', event: 'purchase', userId: 'user789', timestamp: '2024-01-15T10:32:30Z', amount: 299.99 }
    ]
  } as Record<string, Document[]>,

  // Validate MongoDB connection URI format
  validateConnectionURI: (uri: string): boolean => {
    const mongoRegex = /^mongodb(\+srv)?:\/\/([\w\-\.]+(:[\w\-\.]+)?@)?([\w\-\.]+)(:\d+)?(\/[\w\-\.]*)?(\?[\w\-\.\=\&]*)?$/;
    return mongoRegex.test(uri);
  },

  // Simulate connection to MongoDB
  // TODO: Replace with actual backend API call to /api/connect
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
  // TODO: Replace with actual API call to /api/databases
  getDatabases: async (uri: string): Promise<{ success: boolean; data: Database[]; message?: string }> => {
    try {
      const res = await fetch('http://localhost:4000/databases', {
        headers: { 'x-mongo-uri': uri }
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, data: [], message: err.error || 'Failed to fetch databases' };
      }
      const data = await res.json();
      return { success: true, data: data.map((name: string) => ({ name })) };
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, data: [], message };
    }
  },

  // Fetch collections for a database
  // TODO: Replace with actual API call to /api/collections/{dbName}
  getCollections: async (uri: string, dbName: string): Promise<{ success: boolean; data: Collection[]; message?: string }> => {
    try {
      const res = await fetch(`http://localhost:4000/collections/${encodeURIComponent(dbName)}`, {
        headers: { 'x-mongo-uri': uri }
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, data: [], message: err.error || 'Failed to fetch collections' };
      }
      const data = await res.json();
      return { success: true, data: data.map((name: string) => ({ name })) };
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, data: [], message };
    }
  },

  // Fetch documents from a collection
  // TODO: Replace with actual API call to /api/documents/{dbName}/{collectionName}
  getDocuments: async (uri: string, dbName: string, collectionName: string): Promise<{ success: boolean; data: Document[]; message?: string }> => {
    try {
      const res = await fetch(`http://localhost:4000/documents/${encodeURIComponent(dbName)}/${encodeURIComponent(collectionName)}`, {
        headers: { 'x-mongo-uri': uri }
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false, data: [], message: err.error || 'Failed to fetch documents' };
      }
      const data = await res.json();
      return { success: true, data };
    } catch (err: unknown) {
      let message = 'Network error';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      return { success: false, data: [], message };
    }
  }
};

// Connection form component
interface ConnectionFormProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string;
}
const ConnectionForm = ({ onConnect, isConnecting, error }: ConnectionFormProps) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div className="flex items-center mb-6">
        <Server className="h-8 w-8 text-green-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">MongoDB Explorer</h1>
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
  <div className="flex-1 border-r border-gray-200 bg-white">
    <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3">
      <div className="flex items-center">
        {Icon && <Icon className="h-4 w-4 text-gray-600 mr-2" />}
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="ml-2 text-xs text-gray-500">({items.length})</span>
      </div>
    </div>
    <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => {
            const content = item.name || item._id || 'Unnamed';
            // Only truncate if width is less than 180px (arbitrary threshold for demo)
            const shouldTruncate = width !== undefined && width < 180;
            return (
              <div
                key={String(index)}
                className={`p-3 cursor-pointer hover:bg-blue-50 ${
                  selectedItem === content ? 'bg-blue-100 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => onItemSelect(content)}
              >
                <div
                  className={`font-medium text-gray-900${shouldTruncate ? ' truncate' : ''}`}
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
          <div key={String(index)} className="border border-gray-200 rounded-md relative">
            <button
              onClick={() => toggleExpanded(id)}
              className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-blue-50 cursor-pointer"
              title={label}
              aria-label={`Toggle document ${label} details`}
            >
              <span className={`font-medium text-gray-900${shouldTruncate ? ' truncate' : ''}`} style={shouldTruncate ? { maxWidth: '12rem', textOverflow: 'ellipsis', overflow: 'hidden' } : {}}>
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
                      className="p-0.5 rounded hover:bg-blue-100 text-gray-500 hover:text-blue-700"
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
          <div key={String(index)} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg cursor-pointer relative">
            <div className="absolute top-2 right-2 z-10">
              <Tooltip content="Copy JSON">
                <button
                  className="p-0.5 rounded hover:bg-blue-100 text-gray-500 hover:text-blue-700"
                  onClick={() => handleCopy(doc)}
                  aria-label="Copy document JSON"
                  tabIndex={0}
                >
                  <Clipboard className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
            <div className="font-medium text-gray-900 mb-2">
              {typeof doc._id === 'string' ? `ID: ...${doc._id.slice(-6)}` : typeof doc._id === 'number' ? `ID: ...${doc._id}` : `Document ${index + 1}`}
            </div>
            <div className="space-y-1">
              {Object.entries(doc).slice(0, 4).map(([key, value], entryIndex) => {
                const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                const isLong = strValue.length > 20;
                return (
                  <div key={entryIndex} className={`text-sm${shouldTruncate && isLong ? ' truncate max-w-xs' : ''}`} title={strValue} style={shouldTruncate && isLong ? { maxWidth: '12rem', textOverflow: 'ellipsis', overflow: 'hidden' } : {}}>
                    <span className="font-medium text-gray-600">{key}:</span>{' '}
                    <span className="text-gray-900">{isLong && shouldTruncate ? strValue.slice(0, 20) + '…' : strValue}</span>
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
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    let start = Date.now();
    const duration = 2000;
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
      if (elapsed < duration) requestAnimationFrame(tick);
    };
    tick();
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 animate-fade-in font-semibold text-base flex items-center gap-2 bg-blue-600">
      <Clipboard className="h-4 w-4 mr-2 text-white" />
      {message}
      <div className="absolute left-0 bottom-0 w-full h-1 rounded-b overflow-hidden">
        <div className="h-full rounded-b bg-blue-400 transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>
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
function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
    </div>
  );
}
// Helper: SegmentTabIcon and SegmentTabLabel components
function SegmentTabIcon<T extends string>({ options, value, onChange, className = '', ariaLabel }: { options: { icon: React.ReactNode; value: T; label: string; disabled?: boolean; tooltip?: string }[]; value: T; onChange: (v: T) => void; className?: string; ariaLabel?: string }) {
  return (
    <div className={`inline-flex rounded-md bg-gray-100 border border-gray-200 ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map(opt => (
        <Tooltip key={opt.value} content={opt.tooltip || opt.label}>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-75 flex items-center justify-center
              ${value === opt.value ? 'bg-blue-100 text-blue-700 shadow-sm' : opt.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}
              rounded-md first:rounded-l-md last:rounded-r-md border-0`}
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
    <div className={`inline-flex rounded-md bg-gray-100 border border-gray-200 ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map(opt => renderButton
        ? renderButton(opt, value === opt.value)
        : (
          <button
            key={opt.value}
            type="button"
            className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-75
              ${value === opt.value ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}
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
// --- App component: add loader and toast state ---
const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [connectionURI, setConnectionURI] = useState<string>('mongodb://localhost:27017/mydb');
  
  const [databases, setDatabases] = useState<Database[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  
  const [isLoadingDatabases, setIsLoadingDatabases] = useState<boolean>(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  
  const [viewMode, setViewMode] = useState<'table' | 'accordion' | 'card'>('table');
  const [toast, setToast] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // default 30s
  const [layout, setLayout] = useState<'columns' | 'stacked' | 'top-split'>('columns');
  const [stackedLeftWidth, setStackedLeftWidth] = useState(340); // px, for stacked layout
  const [stackedTopHeight, setStackedTopHeight] = useState(0.4); // percent, for stacked layout (Databases)
  const [topSplitTopHeight, setTopSplitTopHeight] = useState(0.4); // percent, for top-split layout
  const [topSplitLeftWidth, setTopSplitLeftWidth] = useState(0.5); // percent, for top-split layout (Databases)
  const VIEW_MODE_OPTIONS_ICON = [
    { label: 'Table View', value: 'table', icon: <Table className="h-4 w-4" /> },
    { label: 'Accordion View', value: 'accordion', icon: <ChevronDown className="h-4 w-4" /> },
    { label: 'Card View', value: 'card', icon: <FileText className="h-4 w-4" />, disabled: true, tooltip: 'Card view is not properly implemented yet' },
  ];
  const LAYOUT_OPTIONS_ICON = [
    { label: 'Side-by-side Layout', value: 'columns', icon: <Columns className="h-4 w-4" /> },
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
  type RefreshOption = typeof REFRESH_OPTIONS_LABEL[number];

  const [copyToast, setCopyToast] = useState<string>('');

  // Auto-refresh functionality
  useEffect(() => {
    if (!isConnected || refreshInterval === 0) return;
    const interval = setInterval(async () => {
      // Refresh databases
      const dbResult = await mongoAPI.getDatabases(connectionURI);
      if (dbResult.success) {
        setDatabases(dbResult.data);
      }
      // Refresh documents if a collection is selected
      if (selectedDatabase && selectedCollection) {
        const docResult = await mongoAPI.getDocuments(connectionURI, selectedDatabase, selectedCollection);
        if (docResult.success) {
          setDocuments(docResult.data);
        }
      }
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [isConnected, connectionURI, selectedDatabase, selectedCollection, refreshInterval]);

  const handleManualRefresh = async () => {
    // Refresh databases
    const dbResult = await mongoAPI.getDatabases(connectionURI);
    if (dbResult.success) {
      setDatabases(dbResult.data);
    }
    // Refresh documents if a collection is selected
    if (selectedDatabase && selectedCollection) {
      const docResult = await mongoAPI.getDocuments(connectionURI, selectedDatabase, selectedCollection);
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
      if (result.success) {
        setConnectionURI(uri);
        setIsConnected(true);
        loadDatabases(uri);
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
  const loadDatabases = useCallback(async (uri: string) => {
    setIsLoadingDatabases(true);
    try {
      const result = await mongoAPI.getDatabases(uri);
      if (result.success) {
        setDatabases(result.data);
      }
    } catch (error) {
      console.error('Failed to load databases:', error);
    } finally {
      setIsLoadingDatabases(false);
    }
  }, []);

  // Handle database selection
  const handleDatabaseSelect = async (dbName: string) => {
    setSelectedDatabase(dbName);
    setSelectedCollection('');
    setCollections([]);
    setDocuments([]);
    setIsLoadingCollections(true);
    try {
      const result = await mongoAPI.getCollections(connectionURI, dbName);
      if (result.success) {
        setCollections(result.data);
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  // Handle collection selection
  const handleCollectionSelect = async (collectionName: string) => {
    setSelectedCollection(collectionName);
    setDocuments([]);
    
    setIsLoadingDocuments(true);
    try {
      const result = await mongoAPI.getDocuments(connectionURI, selectedDatabase, collectionName);
      if (result.success) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
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
        // TableView with resizable columns
        return (
          <div className="overflow-x-auto max-w-full" style={{ maxWidth: '100vw' }}>
            <table
              className="min-w-full divide-y divide-gray-200"
              style={{ minWidth: 'max-content', width: '100%', tableLayout: 'auto' }}
            >
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-20 bg-white" style={{ width: 36 }}></th>
                  {documents.length > 0 && Object.keys(documents[0]).map((key, idx) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative group"
                      style={{ minWidth: 80, paddingRight: 24 }} // extra padding for resizer
                    >
                      <div className="flex items-center justify-between">
                        <span>{key}</span>
                        <span
                          className="absolute right-0 top-0 h-full w-2 cursor-col-resize group-hover:bg-blue-100"
                          style={{ zIndex: 10 }}
                          onMouseDown={e => {
                            e.preventDefault();
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
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <tr key={String(doc._id ?? index)} className="hover:bg-blue-50 cursor-pointer">
                    <td className="px-2 py-2 sticky left-0 z-10 bg-white">
                      <Tooltip content="Copy row as JSON">
                        <button
                          className="p-0.5 rounded hover:bg-blue-100 text-gray-500 hover:text-blue-700"
                          onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(JSON.stringify(doc, null, 2)); setCopyToast('Copied to clipboard!'); }}
                          aria-label="Copy row JSON"
                          tabIndex={0}
                        >
                          <Clipboard className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </td>
                    {Object.entries(doc).map(([key, value], cellIndex) => {
                      const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                      const isLong = strValue.length > 20;
                      const colWidth = tableColWidths[cellIndex] || 180;
                      const shouldTruncate = colWidth < 120;
                      return (
                        <td
                          key={cellIndex}
                          className={`px-3 py-2 whitespace-nowrap text-sm text-gray-900${shouldTruncate && isLong ? ' max-w-xs truncate' : ''}`}
                          title={shouldTruncate && isLong ? strValue : undefined}
                          style={{ minWidth: 'max-content', width: colWidth ? colWidth + 24 : 'auto', maxWidth: 600, textOverflow: shouldTruncate && isLong ? 'ellipsis' : undefined, overflow: shouldTruncate && isLong ? 'hidden' : undefined }}
                        >
                          {shouldTruncate && isLong ? strValue.slice(0, 20) + '…' : strValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
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
    <div className="h-screen flex flex-col bg-gray-100">
      {showLoader && <Loader />}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      {copyToast && <CopyToast message={copyToast} onClose={() => setCopyToast('')} />}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Database className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
          <h1 className="text-xl font-semibold text-gray-900 whitespace-nowrap">MongoDB Explorer</h1>
          <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
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
            onChange={v => setLayout(v as 'columns' | 'stacked' | 'top-split')}
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
                    ${isSelected ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}
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
        </div>
      </div>
      {/* Main content area: layout switch */}
      {layout === 'columns' ? (
        <div className="flex-1 flex overflow-hidden" style={{ minWidth: 600 }}>
          <div style={{ width: mainColWidths[0], minWidth: 120, maxWidth: 500 }}>
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
          {/* Resizer between Databases and Collections */}
          <div
            style={{ width: 6, cursor: 'col-resize', background: '#e5e7eb', zIndex: 20 }}
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
            style={{ width: 6, cursor: 'col-resize', background: '#e5e7eb', zIndex: 20 }}
            onMouseDown={e => onMainColResize(e, 1)}
          />
          {/* Documents column: make entire column scrollable */}
          <div style={{ flex: 1, minWidth: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 z-10 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Documents</h3>
                <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
              </div>
            </div>
            {/* Make the entire column scrollable, not just the table */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16 }}>
              {isLoadingDocuments ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" aria-label="Loading documents" />
                </div>
              ) : (
                renderDocumentView()
              )}
            </div>
          </div>
        </div>
      ) : layout === 'stacked' ? (
        <div className="flex-1 flex overflow-hidden" style={{ minWidth: 600 }}>
          {/* Left: Databases and Collections stacked, resizable width */}
          <div style={{ width: stackedLeftWidth, minWidth: 200, maxWidth: 700, display: 'flex', flexDirection: 'column', height: '100%' }} id="stacked-left">
            <div style={{ flex: `${stackedTopHeight} 1 0%`, minHeight: 0, borderBottom: '1px solid #e5e7eb' }}>
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
              style={{ height: 6, cursor: 'row-resize', background: '#e5e7eb', zIndex: 20 }}
              onMouseDown={handleStackedHorizontalResize}
            />
            <div style={{ flex: `${1 - stackedTopHeight} 1 0%`, minHeight: 0 }}>
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
            style={{ width: 6, cursor: 'col-resize', background: '#e5e7eb', zIndex: 20 }}
            onMouseDown={handleStackedVerticalResize}
          />
          {/* Documents: right side, scrollable */}
          <div style={{ flex: 1, minWidth: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 z-10 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Documents</h3>
                <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16 }}>
              {isLoadingDocuments ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" aria-label="Loading documents" />
                </div>
              ) : (
                renderDocumentView()
              )}
            </div>
          </div>
        </div>
      ) : (
        // Top Split layout
        <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 600 }} id="top-split-main">
          {/* Top: Databases and Collections side by side, resizable height */}
          <div style={{ flex: `0 0 ${topSplitTopHeight * 100}%`, minHeight: 0, display: 'flex', borderBottom: '1px solid #e5e7eb' }} id="top-split-top">
            <div style={{ width: `${topSplitLeftWidth * 100}%`, minWidth: 120, maxWidth: 700, borderRight: '1px solid #e5e7eb', height: '100%' }}>
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
              style={{ width: 6, cursor: 'col-resize', background: '#e5e7eb', zIndex: 20 }}
              onMouseDown={handleTopSplitVerticalResize}
            />
            <div style={{ width: `${(1 - topSplitLeftWidth) * 100}%`, minWidth: 120, maxWidth: 700, height: '100%' }}>
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
            style={{ height: 6, cursor: 'row-resize', background: '#e5e7eb', zIndex: 20 }}
            onMouseDown={handleTopSplitHorizontalResize}
          />
          {/* Bottom: Documents column, fully scrollable */}
          <div style={{ flex: '1 1 60%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3 z-10 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Documents</h3>
                <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16 }}>
              {isLoadingDocuments ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" aria-label="Loading documents" />
                </div>
              ) : (
                renderDocumentView()
              )}
            </div>
          </div>
        </div>
      )}
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
        <span className={`absolute z-50 left-1/2 -translate-x-1/2 ${placement === 'top' ? 'mt-2' : 'mb-2'} px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none ${placement === 'top' ? '' : 'top-full'}`}
          style={placement === 'bottom' ? { top: '100%' } : { bottom: '100%' }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default App;