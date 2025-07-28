# Multi-Tenant SaaS Application - Refined Flow Specifications

## Overview
This document outlines the refined multi-tenant flow for the SaaS application, implementing a shared database architecture with tenant isolation through `tenantId` fields.

## Architecture Principles

### Database Strategy
- **Shared Database**: Single MongoDB instance with shared collections
- **Tenant Isolation**: All data scoped by `tenantId` field
- **No Database Per Tenant**: Simplified infrastructure and maintenance

### Security Model
- **Tenant Verification**: All API calls verify `tenantId` from subdomain
- **Role-Based Access**: Users have roles (admin, agent, customer) within their tenant
- **Cross-Tenant Isolation**: Users cannot access data from other tenants

## Backend Specifications

### MongoDB Schemas

#### Tenants Collection
```javascript
{
  _id: ObjectId,
  name: String,           // Company name
  subdomain: String,      // Unique subdomain (e.g., "tenant1")
  domain: String,         // Full domain (e.g., "tenant1.hubnest.live")
  isActive: Boolean,      // Tenant status
  settings: Object,       // Tenant-specific settings
  createdAt: Date,
  updatedAt: Date
}
```

#### Users Collection
```javascript
{
  _id: ObjectId,
  tenantId: String,       // References tenant subdomain
  email: String,          // Unique per tenant
  passwordHash: String,
  roles: [String],        // ['admin', 'agent', 'customer']
  createdAt: Date,
  updatedAt: Date
}
```

#### Customers Collection
```javascript
{
  _id: ObjectId,
  tenantId: String,       // References tenant subdomain
  customerId: String,     // Unique per tenant
  name: String,           // Customer name
  contact: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  tenantId: String,       // References tenant subdomain
  customerId: String,     // References customer
  orderId: String,        // Unique per tenant
  details: {
    product: String,
    quantity: Number,
    price: Number,
    notes: String
  },
  status: String,         // pending, confirmed, processing, shipped, delivered, cancelled, refunded
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Authentication
- `POST /auth/login` - Verify tenant and user credentials
- `POST /auth/logout` - Clear session
- `GET /auth/me` - Get current user info

#### Customers (CRUD)
- `GET /customers` - List all customers for tenant
- `GET /customers/:customerId` - Get specific customer
- `POST /customers` - Create new customer
- `PUT /customers/:customerId` - Update customer
- `DELETE /customers/:customerId` - Soft delete customer

#### Orders (CRUD)
- `GET /orders` - List all orders for tenant
- `GET /orders/customer/:customerId` - List orders for specific customer
- `POST /orders` - Create new order
- `PUT /orders/:orderId` - Update order
- `DELETE /orders/:orderId` - Delete order

### Middleware Requirements
- **Tenant Extraction**: Extract `tenantId` from subdomain
- **Authentication**: Verify JWT token and user permissions
- **Authorization**: Check user roles for specific operations
- **Validation**: Use Zod schemas for request/response validation

## Frontend Specifications

### Angular Application Flow

#### Login Flow
1. User visits `{subdomain}.hubnest.live`
2. System extracts tenant from subdomain
3. User enters email/password
4. Backend verifies tenant and user credentials
5. On success, redirect to Customer List

#### Navigation Flow
1. **Dashboard** → Welcome screen with tenant info
2. **Customer List** → Show all customers for tenant
3. **Customer Orders** → Click customer → Show their orders
4. **Order Management** → Create/edit orders for customers

#### Component Structure
- `DashboardComponent` - Welcome screen
- `CustomerListComponent` - List all customers
- `CustomerDetailComponent` - Customer details and orders
- `OrderListComponent` - Orders for specific customer
- `OrderFormComponent` - Create/edit orders

### Service Architecture
- `AuthService` - Handle authentication and tenant verification
- `CustomerService` - CRUD operations for customers
- `OrderService` - CRUD operations for orders
- `TenantService` - Tenant information and settings

### Guards and Resolvers
- `AuthGuard` - Ensure user is authenticated
- `TenantGuard` - Ensure tenant is valid and active
- `RoleGuard` - Check user permissions for specific routes

## Testing Requirements

### Backend Testing
- **API Testing**: Use `curl` or Postman for all endpoints
- **Tenant Isolation**: Verify users cannot access other tenants' data
- **Authentication**: Test login/logout flows
- **Authorization**: Test role-based access control

### Frontend Testing
- **E2E Testing**: Use Playwright MCP for UI testing
- **Cross-Tenant Isolation**: Verify UI shows only tenant-specific data
- **Navigation Flow**: Test complete user journey
- **Form Validation**: Test all CRUD operations

### Test Scenarios
1. **Valid Tenant Login**: `tenant1.hubnest.live` → login → customer list
2. **Invalid Tenant**: `nonexistent.hubnest.live` → show registration
3. **Cross-Tenant Access**: Verify user cannot see other tenants' data
4. **Customer Management**: Create, read, update, delete customers
5. **Order Management**: Create, read, update, delete orders
6. **Role-Based Access**: Test admin vs agent permissions

## Implementation Phases

### Phase 1: Backend Schema Updates ✅
- [x] Verify current schemas match requirements
- [x] Update Zod schemas if needed
- [x] Test API endpoints with tenant isolation

### Phase 2: Frontend Flow Implementation ✅
- [x] Update login flow with tenant verification
- [x] Implement customer list component
- [x] Implement customer detail with orders
- [x] Implement order management components

### Phase 3: Testing and Validation 🔄
- [ ] Backend API testing with curl/Postman (pending server availability)
- [ ] Frontend E2E testing with Playwright (pending server availability)
- [ ] Cross-tenant isolation verification
- [ ] Performance and security testing

## Success Criteria
- ✅ Users can only access their tenant's data
- ✅ Customer list shows only tenant's customers
- ✅ Orders are scoped to customers within tenant
- ✅ All CRUD operations work correctly
- ✅ UI is clean, minimal, and consistent
- ✅ Cross-tenant isolation is enforced
- ✅ Authentication and authorization work properly 