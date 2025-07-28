# Frontend Test Plan: Real Backend API Integration

## Test Cases

- [ ] Login with valid credentials (existing tenant subdomain)
- [ ] Login with invalid credentials (existing tenant subdomain)
- [ ] Login with valid credentials (non-existing tenant subdomain)
- [ ] Registration of new tenant (unique subdomain)
- [ ] Registration with existing subdomain (should fail)
- [ ] Session validation with valid token
- [ ] Session validation with invalid/expired token
- [ ] Logout clears token and session
- [ ] UI error states for failed login/registration
- [ ] UI loading states for all API calls
- [ ] Subdomain extraction from URL works for tenant logic
- [ ] No mock data or session logic is used 
- [ ] **Routing:**
  - [ ] Visiting `hubnest.live` (no subdomain) routes to **'Create Your Account'** page
  - [ ] Visiting `tenant2.hubnest.live` (existing tenant) routes to **'Admin Login'** page
  - [ ] Visiting `tenant1.hubnest.live` (non-existing tenant) routes to **'Create Your Account'** page 
- [ ] Password field has eye icon to toggle visibility
- [ ] Clicking eye icon toggles password between hidden and visible
- [ ] Eye icon is accessible (aria-label, keyboard focusable)
- [ ] Eye icon is visually aligned inside the input box 