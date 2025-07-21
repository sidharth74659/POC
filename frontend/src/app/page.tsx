'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Server, FileText, Table, ChevronDown, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

// API Integration Layer - Single file for all MongoDB operations
type ConnectResponse = { success: boolean; message: string };
type Database = { name: string; size?: string; collections?: number };
type Collection = { name: string; count?: number; avgSize?: string };
type Document = { [key: string]: any };

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
    } catch (err) {
      return { success: false, message: 'Network error: ' + (err?.message || err) };
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
      // The backend returns an array of names, wrap as Database objects
      return { success: true, data: data.map((name: string) => ({ name })) };
    } catch (err: any) {
      return { success: false, data: [], message: err?.message || 'Network error' };
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
      // The backend returns an array of names, wrap as Collection objects
      return { success: true, data: data.map((name: string) => ({ name })) };
    } catch (err: any) {
      return { success: false, data: [], message: err?.message || 'Network error' };
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
    } catch (err: any) {
      return { success: false, data: [], message: err?.message || 'Network error' };
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
}
const Column = ({ title, items, selectedItem, onItemSelect, isLoading, icon: Icon }: ColumnProps) => (
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
          {items.map((item, index) => (
            <div
              key={item.name || item._id || index}
              className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                selectedItem === (item.name || item._id) ? 'bg-blue-100 border-r-2 border-blue-500' : ''
              }`}
              onClick={() => onItemSelect(item.name || item._id)}
            >
              <div className="font-medium text-gray-900">
                {item.name || item._id || 'Unnamed'}
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
          ))}
        </div>
      )}
    </div>
  </div>
);

// Document views
interface TableViewProps {
  documents: Document[];
}
const TableView = ({ documents }: TableViewProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {documents.length > 0 && Object.keys(documents[0]).map(key => (
            <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {documents.map((doc, index) => (
          <tr key={doc._id || index} className="hover:bg-gray-50">
            {Object.entries(doc).map(([key, value], cellIndex) => (
              <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface AccordionViewProps {
  documents: Document[];
}
const AccordionView = ({ documents }: AccordionViewProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(new Set());

  const toggleExpanded = (id: string | number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-2">
      {documents.map((doc, index) => {
        const id = doc._id || index;
        const isExpanded = expandedItems.has(id);
        return (
          <div key={id} className="border border-gray-200 rounded-md">
            <button
              onClick={() => toggleExpanded(id)}
              className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-900">
                Document {typeof id === 'string' ? id.slice(-6) : id}
              </span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {isExpanded && (
              <div className="px-4 py-3 bg-white">
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
}
const CardView = ({ documents }: CardViewProps) => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {documents.map((doc, index) => (
      <div key={doc._id || index} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="font-medium text-gray-900 mb-2">
          {doc._id && typeof doc._id === 'string' ? `ID: ...${doc._id.slice(-6)}` : `Document ${index + 1}`}
        </div>
        <div className="space-y-1">
          {Object.entries(doc).slice(0, 4).map(([key, value], entryIndex) => (
            <div key={entryIndex} className="text-sm">
              <span className="font-medium text-gray-600">{key}:</span>{' '}
              <span className="text-gray-900">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
          {Object.keys(doc).length > 4 && (
            <div className="text-xs text-gray-500 italic">
              ...and {Object.keys(doc).length - 4} more fields
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Main application component
const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [connectionURI, setConnectionURI] = useState<string>('');
  
  const [databases, setDatabases] = useState<Database[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  
  const [isLoadingDatabases, setIsLoadingDatabases] = useState<boolean>(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  
  const [viewMode, setViewMode] = useState<'table' | 'accordion' | 'card'>('table');

  // Auto-refresh functionality
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(async () => {
      console.log('Auto-refreshing data...');
      
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
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, connectionURI, selectedDatabase, selectedCollection]);

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
        return <AccordionView documents={documents} />;
      case 'card':
        return <CardView documents={documents} />;
      default:
        return <TableView documents={documents} />;
    }
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-green-600 mr-3" />
          <h1 className="text-xl font-semibold text-gray-900">MongoDB Explorer</h1>
          <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            READ-ONLY DEMO
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 mr-4">View:</span>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            title="Table View"
          >
            <Table className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('accordion')}
            className={`p-2 rounded ${viewMode === 'accordion' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            title="Accordion View"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            title="Card View"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden">
        <Column
          title="Databases"
          items={databases}
          selectedItem={selectedDatabase}
          onItemSelect={handleDatabaseSelect}
          isLoading={isLoadingDatabases}
          icon={Database}
        />
        
        <Column
          title="Collections"
          items={collections}
          selectedItem={selectedCollection}
          onItemSelect={handleCollectionSelect}
          isLoading={isLoadingCollections}
          icon={FileText}
        />
        
        <div className="flex-1 bg-white">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-3">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-900">Documents</h3>
              <span className="ml-2 text-xs text-gray-500">({documents.length})</span>
            </div>
          </div>
          <div className="overflow-y-auto p-4" style={{ height: 'calc(100vh - 140px)' }}>
            {isLoadingDocuments ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              renderDocumentView()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;