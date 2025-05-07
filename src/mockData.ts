import type { Project, Tile, Issue, SubTask } from './types';

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate projects
const projects: Project[] = [
  {
    id: 'p1',
    name: 'E-commerce Platform',
    purpose: 'Building a modern e-commerce solution with microservices architecture',
    tileCount: 3,
  },
  {
    id: 'p2',
    name: 'Analytics Dashboard',
    purpose: 'Real-time analytics and reporting system for business metrics',
    tileCount: 2,
  },
];

// Generate tiles
const tiles: Tile[] = [
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
        { method: 'GET', path: '/api/products', payloadExample: '{ "page": 1, "limit": 10 }' },
        { method: 'POST', path: '/api/products', payloadExample: '{ "name": "Product", "price": 99.99 }' }
      ],
      sharedComponents: 'ProductCard, ProductGrid, SearchBar',
      testCases: [
        { id: 'tc1', text: 'Product creation with valid data succeeds', checked: true },
        { id: 'tc2', text: 'Search returns relevant results', checked: false }
      ]
    }
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
        { method: 'POST', path: '/api/cart/items', payloadExample: '{ "productId": "123", "quantity": 1 }' }
      ],
      sharedComponents: 'CartWidget, CheckoutForm',
      testCases: [
        { id: 'tc3', text: 'Add item to cart updates total', checked: true }
      ]
    }
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
        { method: 'POST', path: '/api/metrics', payloadExample: '{ "metric": "sales", "value": 100 }' }
      ],
      sharedComponents: 'MetricsChart, DataGrid',
      testCases: [
        { id: 'tc4', text: 'Metrics are processed correctly', checked: false }
      ]
    }
  }
];

// Generate issues
const issues: Issue[] = [
  {
    id: 'i1',
    tileId: 't1',
    issueNumber: 'ISSUE-101',
    title: 'Add bulk product import feature',
    assignee: 'Developer',
    priority: 'High',
    status: 'Development In Progress',
    estimation: '3 days',
    forkedDocumentContent: `# Product Catalog Service
    
This service manages the product catalog, including product information, categories, and search functionality.

## Overview
The Product Catalog Service is a core component that provides product management capabilities.

++## Bulk Import Feature
The service now supports bulk import of products via CSV files.++

--## Manual Product Creation
Products are created one at a time through the API.--`,
    tags: ['v1.2', 'feature'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'i2',
    tileId: 't2',
    issueNumber: 'ISSUE-102',
    title: 'Implement cart expiration',
    assignee: 'Developer',
    priority: 'Medium',
    status: 'Open',
    estimation: '2 days',
    forkedDocumentContent: `# Shopping Cart Service

Manages user shopping carts and checkout process.

## Overview
The Shopping Cart Service handles temporary storage of items and checkout flow.

++## Cart Expiration
Carts will automatically expire after 24 hours of inactivity.++`,
    tags: ['v1.1'],
    createdAt: new Date('2024-01-16')
  }
];

// Generate subtasks
const subtasks: SubTask[] = [
  {
    id: 's1',
    issueId: 'i1',
    description: 'Create CSV parser utility',
    status: 'Open'
  },
  {
    id: 's2',
    issueId: 'i1',
    description: 'Add validation for bulk import',
    status: 'Open'
  },
  {
    id: 's3',
    issueId: 'i2',
    description: 'Implement cleanup job',
    status: 'Closed'
  }
];

export const mockData = {
  projects,
  tiles,
  issues,
  subtasks,
  generateId
}; 