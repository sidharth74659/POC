# Multi-Tenant SaaS Specs

## Requirements
- Multi-tenant Express backend with subdomain-based tenant detection
- Cloudflare tunnel for public subdomain access
- MongoDB for tenant, user, and order data
- Admin UI for tenant registration and user management
- Role-based access (admin/user)
- Secure authentication (JWT)
- No cross-tenant access
- Minimal, clear frontend UI

## Backend APIs
- Tenant detection middleware
- POST /api/tenants/register
- POST /api/auth/login
- GET/POST/PUT/DELETE /api/users (admin only)
- GET/POST /api/orders (user only)
- All APIs scoped by tenantId

## Frontend Flows
- Detect subdomain, check tenant
- Register tenant if not found
- Login for valid tenants
- Dashboard (admin: users, user: orders)
- Logout

## Frontend Deployment & Static Serving
- Angular frontend is built and output is placed in `frontend/dist/frontend/browser/`.
- On deployment, build output is copied to `backend/public/`.
- Backend serves static files from `public/` using Express static middleware.
- All non-API, non-static requests are routed to `index.html` to support Angular client-side routing.
- API routes (`/api/*`) are registered before static/frontend routes and remain protected as before.
- JWT authentication is only enforced for API routes, not for static/frontend routes.
- Route order in `server.js` ensures correct separation and behavior.

## Security
- All queries filter by tenantId
- JWT-based auth, role checks
- Proper error handling

## Testing
- Terminal for backend API
- Puppeteer for frontend flows

---

## Progress Checklist
- [ ] Tenant detection middleware
- [ ] Tenant registration API
- [ ] Auth/login API
- [ ] User management APIs
- [ ] Order management APIs
- [ ] Role-based access control
- [ ] Frontend: subdomain detection
- [ ] Frontend: registration page
- [ ] Frontend: login page
- [ ] Frontend: dashboard (admin/users, user/orders)
- [ ] Frontend: logout
- [ ] Security checks (no cross-tenant access)
- [ ] Error handling and messages
- [ ] End-to-end testing 