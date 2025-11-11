# Unified Platform - Multi-Tenant SaaS POC

A minimal working example (MWE) of a multi-tenant SaaS backend + frontend with three product modules: Digital Forms, Maintenance, and User Management.

## Architecture

- **Backend**: Node.js/Express.js server with MongoDB and Redis
- **Frontend**: Simple HTML/JavaScript pages served by the backend
- **Authentication**: JWT-based with tenant isolation
- **Database**: MongoDB for persistent data
- **Cache**: Redis for rate limiting and caching
- **Containerization**: Docker Compose for all services

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── app.js                 # Main Express server
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Auth, tenant, rate limiting
│   │   ├── models/                # MongoDB models
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   └── util/                  # Utilities (logger, Redis client)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── index.html                 # Login/Dashboard
│   ├── forms.html                 # Digital Forms module
│   ├── maintenance.html          # Maintenance module
│   ├── user-mgmt.html            # User Management module
│   └── data-visualization.html   # Data visualization
├── docker-compose.yml
└── .env
```

## Prerequisites

- Docker and Docker Compose
- (Optional) Keycloak running on localhost:8080 (for production; mocked in POC)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/v1
   - Health check: http://localhost:3000/health

## Setup and Testing

### 1. Create a Tenant

```bash
curl -X POST http://localhost:3000/api/v1/core/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "tenant-001",
    "name": "Test Tenant",
    "subdomain": "test"
  }'
```

### 2. Create a User

```bash
curl -X POST http://localhost:3000/api/v1/core/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-001",
    "tenantId": "tenant-001",
    "keycloakUserId": "kc-001",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "roles": ["admin"]
  }'
```

### 3. Login and Get JWT Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "tenantId": "tenant-001"
  }'
```

Save the `token` from the response.

### 4. Test API Endpoints

**Create a Form:**
```bash
curl -X POST http://localhost:3000/api/v1/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "formId": "form-001",
    "title": "Customer Feedback Form",
    "description": "Collect customer feedback",
    "status": "published"
  }'
```

**List Forms:**
```bash
curl -X GET http://localhost:3000/api/v1/forms \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Create a Work Order:**
```bash
curl -X POST http://localhost:3000/api/v1/maintenance/work_orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "workOrderId": "wo-001",
    "title": "Fix HVAC System",
    "description": "HVAC not working in building A",
    "priority": "high",
    "location": "Building A, Floor 3"
  }'
```

**List Work Orders:**
```bash
curl -X GET http://localhost:3000/api/v1/maintenance/work_orders \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**List Users:**
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Assign Role to User:**
```bash
curl -X POST http://localhost:3000/api/v1/users/user-001/assign-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "role": "manager"
  }'
```

### 5. View Data Visualization

Navigate to http://localhost:3000/data-visualization.html (requires login) to see:
- All MongoDB collections (tenants, users, forms, work orders, roles)
- All Redis keys and their values
- Statistics dashboard

## Frontend Testing Flow

1. **Login:**
   - Navigate to http://localhost:3000
   - Enter tenant ID: `tenant-001`
   - Enter email: `test@example.com`
   - Enter password: `test123`
   - Click "Login"

2. **Dashboard:**
   - After login, you'll see the dashboard with 4 tiles:
     - Digital Forms
     - Maintenance
     - User Management
     - Data Visualization

3. **Test Each Module:**
   - Click on "Digital Forms" → Create a form
   - Click on "Maintenance" → Create a work order
   - Click on "User Management" → View users and assign roles
   - Click on "Data Visualization" → View all MongoDB and Redis data

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login and get JWT token

### Core (Tenant/User Management)
- `POST /api/v1/core/tenants` - Create tenant
- `GET /api/v1/core/tenants` - List all tenants
- `GET /api/v1/core/tenants/:tenantId` - Get tenant by ID
- `POST /api/v1/core/users` - Create user (no auth required for onboarding)
- `GET /api/v1/core/users` - List users in tenant (requires auth)
- `GET /api/v1/core/users/:userId` - Get user by ID (requires auth)

### Digital Forms
- `POST /api/v1/forms` - Create form (requires auth)
- `GET /api/v1/forms` - List forms (requires auth)
- `GET /api/v1/forms/:formId` - Get form by ID (requires auth)
- `PUT /api/v1/forms/:formId` - Update form (requires auth)
- `DELETE /api/v1/forms/:formId` - Delete form (requires auth)

### Maintenance
- `POST /api/v1/maintenance/work_orders` - Create work order (requires auth)
- `GET /api/v1/maintenance/work_orders` - List work orders (requires auth)
- `GET /api/v1/maintenance/work_orders/:workOrderId` - Get work order (requires auth)
- `PUT /api/v1/maintenance/work_orders/:workOrderId` - Update work order (requires auth)
- `DELETE /api/v1/maintenance/work_orders/:workOrderId` - Delete work order (requires auth)

### User Management
- `GET /api/v1/users` - List users in tenant (requires auth)
- `GET /api/v1/users/:userId` - Get user by ID (requires auth)
- `POST /api/v1/users/:userId/assign-role` - Assign role to user (requires auth)

### Data Visualization
- `GET /api/v1/data/visualize` - Get all MongoDB and Redis data (no auth required for POC)

## Multi-Tenant Isolation

- All API requests require a JWT token with `tenant_id`, `user_id`, and `roles`
- Every MongoDB query includes `tenantId` filter
- Redis keys are namespaced: `tenant:{tenantId}:...`
- Tenant middleware validates tenant exists and is active

## Services Used

### MongoDB
- Stores: tenants, users, forms, work orders, roles
- All documents include `tenantId` for isolation
- Indexed on `tenantId` for performance

### Redis
- Rate limiting: `tenant:{tenantId}:rateLimit:{userId}:{window}`
- Can be extended for caching frequently accessed data
- Keys automatically expire based on TTL

## Environment Variables

See `.env` file:
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection URL
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Server port (default: 3000)

## Stopping Services

```bash
docker-compose down
```

To remove volumes (clears all data):
```bash
docker-compose down -v
```

## Troubleshooting

1. **Backend not starting:**
   - Check logs: `docker-compose logs backend`
   - Ensure MongoDB and Redis are running: `docker-compose ps`

2. **Frontend not loading:**
   - Verify frontend directory is mounted: `docker-compose exec backend ls -la /app/frontend`
   - Check backend logs for path errors

3. **Authentication errors:**
   - Ensure user exists in MongoDB
   - Verify JWT token is valid and not expired
   - Check tenant status is "active"

4. **Redis connection issues:**
   - Verify Redis is running: `docker-compose ps redis`
   - Check Redis URL in `.env`

## Assumptions

1. **Keycloak Integration**: The POC mocks Keycloak login. In production, replace `/api/v1/auth/login` with actual Keycloak token endpoint.
2. **Password Validation**: Currently accepts any password. In production, verify against Keycloak or hash/verify passwords.
3. **Tenant Onboarding**: `POST /api/v1/core/users` is open for onboarding. In production, add proper admin authentication.
4. **Data Visualization**: `/api/v1/data/visualize` is open for POC. In production, restrict to admin users.

## Next Steps for Production

1. Integrate real Keycloak for authentication
2. Add password hashing and validation
3. Implement proper admin authentication for tenant/user creation
4. Add input validation and sanitization
5. Implement proper error handling and logging
6. Add unit and integration tests
7. Set up CI/CD pipeline
8. Add API documentation (Swagger/OpenAPI)
9. Implement proper RBAC with permission checks
10. Add monitoring and alerting

