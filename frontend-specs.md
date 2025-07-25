# Frontend Specs: Real Backend API Integration

## Authentication
- Login: POST `/api/auth/login` with `{ email, password }` (tenant inferred from subdomain)
- Logout: POST `/api/auth/logout` (stateless, frontend clears token)
- Session Validation: GET `/api/auth/me` with Bearer token

## Tenant Logic
- Subdomain is extracted from `window.location.host`.
- Tenant lookup and registration use subdomain from URL.
- No tenantId is sent in login body; backend uses subdomain.

## Routing Requirements
- If there is **no subdomain** (e.g., visiting `hubnest.live`), route user to **'Create Your Account'** page (tenant registration).
- If there **is a subdomain** (e.g., `tenant2.hubnest.live`):
  - If the tenant exists, route user to **'Admin Login'** page.
  - If the tenant does not exist, route user to **'Create Your Account'** page (tenant registration).

## Mock Data
- All mock data and session logic removed. All data comes from backend API.

## UI
- Login and registration forms use real API endpoints.
- Error and loading states handled for all API calls. 

## Password Visibility Toggle
- Login form password field includes an eye icon to toggle show/hide password.
- Icon is accessible (aria-label, keyboard focusable).
- Icon is visually aligned inside the input box.
- Uses lucide-react Eye/EyeOff icons.
- Only shown for password fields. 