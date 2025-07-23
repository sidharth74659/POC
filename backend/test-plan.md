# Multi-Tenant SaaS Test Plan

## Test Cases

- [ ] Tenant detection: unknown subdomain redirects to registration
- [ ] Tenant registration: creates tenant, admin user, DNS record
- [ ] Login: valid tenant, valid/invalid credentials
- [ ] Dashboard: admin sees users, user sees orders
- [ ] User management: admin can add/edit/delete users (tenant-scoped)
- [ ] Order management: user can view/create orders (tenant-scoped)
- [ ] Security: no cross-tenant access (API and UI)
- [ ] Logout: JWT invalidation, redirect to login
- [ ] Error messages: invalid tenant, invalid login, forbidden actions
- [ ] Cloudflare DNS: new subdomain is accessible after registration

## Testing Tools
- Terminal (curl) for backend API
- Puppeteer for frontend flows

---

## Progress
- [ ] Backend API tests
- [ ] Frontend UI tests
- [ ] End-to-end multi-tenant flow 

## Frontend Static Serving Test Plan
- [ ] Start backend server and visit `/` — Angular app should load.
- [ ] Visit `/dashboard` (or any Angular route) directly — Angular app should load (no 404).
- [ ] Visit `/api/auth/login` — API route should respond as expected (protected if needed).
- [ ] Visit `/api/orders` — API route should require JWT/auth as before.
- [ ] Static assets (JS, CSS, favicon) should load without authentication.
- [ ] No API routes should be accessible without proper authentication.
- [ ] No static/frontend routes should require authentication. 