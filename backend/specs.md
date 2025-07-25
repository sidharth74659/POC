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

# Backend API End-to-End Testing Walkthrough

This guide walks you through testing the multi-tenant backend API from tenant creation to using protected routes, using only curl commands. Each step includes a brief explanation and the exact curl command to run. Replace values as needed for your test case.

---

## 1. Create a New Tenant
Creates a new tenant and admin user. Replace values as needed.

```sh
curl -X POST http://localhost:3000/api/tenants \
  -H 'Content-Type: application/json' \
  -d '{
    "companyName": "TestCo",
    "requestedSubdomain": "testtenant",
    "adminEmail": "admin@testtenant.com",
    "adminPassword": "TestPass123!"
  }'
```

**Expected:** JSON message with the new tenant's URL.

---

## 2. Login as Tenant Admin
Logs in as the admin user for the tenant. The response includes a JWT token.

```sh
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Host: testtenant.hubnest.live' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@testtenant.com",
    "password": "TestPass123!"
  }'
```

**Expected:** JSON with a `token` field. **Copy the value of `token` for use in the next steps.**

---

## 3. Check Tenant Info
Checks if the tenant exists and returns its info.

```sh
curl -X GET http://localhost:3000/api/tenants/check \
  -H 'Host: testtenant.hubnest.live'
```

**Expected:** JSON with tenant details.

---

## 4. List Orders (Protected Route)
Lists all orders for the tenant. Requires the JWT token from step 2.

```sh
curl -X GET http://localhost:3000/api/orders \
  -H 'Host: testtenant.hubnest.live' \
  -H 'Authorization: Bearer <PASTE_TOKEN_HERE>'
```

**Expected:** JSON array of orders (empty if none exist).

---

## 5. Create an Order (Protected Route)
Creates a new order for the tenant. Requires the JWT token from step 2.

```sh
curl -X POST http://localhost:3000/api/orders \
  -H 'Host: testtenant.hubnest.live' \
  -H 'Authorization: Bearer <PASTE_TOKEN_HERE>' \
  -H 'Content-Type: application/json' \
  -d '{
    "product": "Widget",
    "quantity": 5,
    "price": 100
  }'
```

**Expected:** JSON with the created order details.

---

## 6. List Orders Again
Verify the new order appears in the list.

```sh
curl -X GET http://localhost:3000/api/orders \
  -H 'Host: testtenant.hubnest.live' \
  -H 'Authorization: Bearer <PASTE_TOKEN_HERE>'
```

**Expected:** JSON array including the new order.

---

## Notes
- Replace `testtenant` and email/password values as needed for your test.
- The `Host` header is required to simulate subdomain-based tenant routing.
- Always use the full JWT token as returned by the login step.
- For a new tenant, repeat steps 1–6 with a different subdomain and admin email. 

---

## Systematic Multi-Tenant API Testing

- All API endpoints are tested using the actual domains (e.g., hubnest.live, <subdomain>.hubnest.live) as per production setup.
- Each test case is tracked in the test plan and results are updated after each run.
- Valid and invalid tenants are tracked in a dedicated file (`backend/tenant-tracking.json`) for reference during testing and automation.
- Cross-tenant isolation, security, and edge cases are explicitly tested and documented.
- Any issues found are root-caused, fixed, and retested until all cases pass. 

---

## Systematic Multi-Tenant API Testing Results

- All tested endpoints enforce subdomain and tenant isolation as intended.
- Subdomain validation now prevents invalid or unsafe subdomains.
- Cross-tenant access attempts are correctly rejected.
- All tested edge cases (invalid credentials, missing headers, malformed requests, invalid JWTs) return proper errors and status codes.
- No sensitive data is leaked in error messages.
- See test-plan.md and tenant-tracking.json for detailed results and tracking. 