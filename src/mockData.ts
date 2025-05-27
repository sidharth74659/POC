import type { IProject, ITile, IIssue, ISubTask } from './interfaces';

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate projects
const projects: IProject[] = [
  {
    id: 'p1',
    name: 'E-commerce Platform',
    purpose: 'Building a modern e-commerce solution with microservices architecture',
    tileCount: 3,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    owner: 'John Doe',
    tags: ['microservices', 'e-commerce', 'react']
  },
  {
    id: 'p2',
    name: 'Analytics Dashboard',
    purpose: 'Real-time analytics and reporting system for business metrics',
    tileCount: 2,
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-16'),
    owner: 'Jane Smith',
    tags: ['analytics', 'dashboard', 'real-time']
  },
];

// Generate tiles
const tiles: ITile[] = [
  // E-commerce Platform Tiles
  {
    id: 't1',
    projectId: 'p1',
    name: 'Product Catalog Service',
    mainDocumentContent: `# Product Catalog Service
    
This service manages the product catalog, including product information, categories, and search functionality.

## Overview
The Product Catalog Service is a core component that provides product management capabilities.`,
    templateData: {
      intent: 'Provide a centralized product management system',
      scenario: 'Merchants need to manage their product catalog and customers need to browse products',
      flow: '1. Merchant uploads product\n2. System processes and indexes product\n3. Product becomes available in search',
      apis: [
        { 
          method: 'GET', 
          path: '/api/products', 
          description: 'Get products with pagination',
          payloadExample: '{ "page": 1, "limit": 10 }',
          responseExample: '{ "products": [], "total": 100 }'
        },
        { 
          method: 'POST', 
          path: '/api/products', 
          description: 'Create a new product',
          payloadExample: '{ "name": "Product", "price": 99.99 }',
          responseExample: '{ "id": "123", "name": "Product" }'
        }
      ],
      sharedComponents: 'ProductCard, ProductGrid, SearchBar',
      testCases: [
        { id: 'tc1', text: 'Product creation with valid data succeeds', checked: true, priority: 'high' },
        { id: 'tc2', text: 'Search returns relevant results', checked: false, priority: 'medium' }
      ],
      dependencies: ['Authentication Service', 'File Upload Service'],
      assumptions: ['Products have unique SKUs', 'Images are stored externally'],
      constraints: ['Max 10MB per image', 'SKU must be alphanumeric']
    },
    version: '1.0.0',
    status: 'approved',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-10'),
    owner: 'John Doe',
    tags: ['backend', 'api']
  },
  {
    id: 't2',
    projectId: 'p1',
    name: 'Shopping Cart Service',
    mainDocumentContent: `# Shopping Cart Service

Manages user shopping carts and checkout process.

## Overview
The Shopping Cart Service handles temporary storage of items and checkout flow.`,
    templateData: {
      intent: 'Manage user shopping sessions',
      scenario: 'Users need to add products to cart and proceed to checkout',
      flow: '1. User adds product to cart\n2. Cart is updated\n3. User proceeds to checkout',
      apis: [
        { 
          method: 'POST', 
          path: '/api/cart/items', 
          description: 'Add item to cart',
          payloadExample: '{ "productId": "123", "quantity": 1 }',
          responseExample: '{ "cartId": "456", "total": 99.99 }'
        }
      ],
      sharedComponents: 'CartWidget, CheckoutForm',
      testCases: [
        { id: 'tc3', text: 'Add item to cart updates total', checked: true, priority: 'high' }
      ],
      dependencies: ['Product Catalog Service', 'Payment Service'],
      assumptions: ['Users are authenticated', 'Products exist'],
      constraints: ['Max 100 items per cart']
    },
    version: '1.0.0',
    status: 'review',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
    owner: 'Jane Smith',
    tags: ['backend', 'cart']
  },
  // Analytics Dashboard Tiles
  {
    id: 't3',
    projectId: 'p2',
    name: 'Metrics Collection',
    mainDocumentContent: `# Metrics Collection Service

Collects and processes real-time metrics from various sources.

## Overview
This service aggregates metrics from different parts of the system.`,
    templateData: {
      intent: 'Collect and process metrics in real-time',
      scenario: 'System needs to track various business metrics',
      flow: '1. Events are captured\n2. Metrics are processed\n3. Data is stored',
      apis: [
        { 
          method: 'POST', 
          path: '/api/metrics', 
          description: 'Submit metrics data',
          payloadExample: '{ "metric": "sales", "value": 100 }',
          responseExample: '{ "success": true }'
        }
      ],
      sharedComponents: 'MetricsChart, DataGrid',
      testCases: [
        { id: 'tc4', text: 'Metrics are processed correctly', checked: false, priority: 'medium' }
      ],
      dependencies: ['Event Bus', 'Time Series Database'],
      assumptions: ['Events are in JSON format'],
      constraints: ['Max 1000 events per second']
    },
    version: '1.0.0',
    status: 'draft',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-14'),
    owner: 'Bob Johnson',
    tags: ['analytics', 'metrics']
  }
];

// Generate issues
const issues: IIssue[] = [
  {
    id: 'i1',
    tileId: 't1',
    issueNumber: 'ISSUE-101',
    title: 'Add bulk product import feature',
    description: 'Implement bulk import functionality for products via CSV files',
    assignee: 'Developer',
    priority: 'High',
    status: 'Development In Progress',
    type: 'Feature',
    forkedDocumentContent: `# Product Catalog Service
    
This service manages the product catalog, including product information, categories, and search functionality.

## Overview
The Product Catalog Service is a core component that provides product management capabilities.

++## Bulk Import Feature
The service now supports bulk import of products via CSV files.++

--## Manual Product Creation
Products are created one at a time through the API.--`,
    originalDocumentContent: `# Product Catalog Service
    
This service manages the product catalog, including product information, categories, and search functionality.

## Overview
The Product Catalog Service is a core component that provides product management capabilities.

## Manual Product Creation
Products are created one at a time through the API.`,
    tags: ['v1.2', 'feature'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    estimation: '3 days',
    reporter: 'Product Manager',
    watchers: ['John Doe', 'Jane Smith']
  },
  {
    id: 'i2',
    tileId: 't2',
    issueNumber: 'ISSUE-102',
    title: 'Implement cart expiration',
    description: 'Add automatic cart expiration after 24 hours of inactivity',
    assignee: 'Developer',
    priority: 'Medium',
    status: 'Open',
    type: 'Enhancement',
    forkedDocumentContent: `# Shopping Cart Service

Manages user shopping carts and checkout process.

## Overview
The Shopping Cart Service handles temporary storage of items and checkout flow.

++## Cart Expiration
Carts will automatically expire after 24 hours of inactivity.++`,
    originalDocumentContent: `# Shopping Cart Service

Manages user shopping carts and checkout process.

## Overview
The Shopping Cart Service handles temporary storage of items and checkout flow.`,
    tags: ['v1.1'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    estimation: '2 days',
    reporter: 'Tech Lead'
  }
];

// Generate subtasks
const subtasks: ISubTask[] = [
  {
    id: 's1',
    issueId: 'i1',
    description: 'Create CSV parser utility',
    status: 'Open',
    createdAt: new Date('2024-01-15'),
    assignee: 'Developer',
    order: 1
  },
  {
    id: 's2',
    issueId: 'i1',
    description: 'Add validation for bulk import',
    status: 'Open',
    createdAt: new Date('2024-01-15'),
    assignee: 'Developer',
    order: 2
  },
  {
    id: 's3',
    issueId: 'i2',
    description: 'Implement cleanup job',
    status: 'Closed',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    assignee: 'Developer',
    order: 1
  }
];

export const mockData = {
  projects,
  tiles,
  issues,
  subtasks,
  generateId
}; 