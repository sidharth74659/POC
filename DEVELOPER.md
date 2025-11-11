# Developer Guide - Multi-Tenant SaaS Platform

## Prerequisites

- Docker & Docker Compose
- Node.js 20.19.0 (via nvm)
- Cloudflared CLI (logged in)

## Quick Start

### 1. Start Services

```bash
docker-compose up -d
```

Verify services:
```bash
docker-compose ps
```

### 2. Seed Test Data

```bash
docker-compose exec backend node scripts/seed-data.js
```

**Expected Output:**
- 3 tenants created (tenant1, tenant2, tenant3)
- Users, forms, work orders for each tenant
- Test credentials displayed

### 3. Setup Cloudflare Tunnel

**Create tunnel (first time only):**
```bash
cloudflared tunnel create unified-platform-poc
```

**Configure DNS route (wildcard - use quotes):**
```bash
cloudflared tunnel route dns unified-platform-poc "*.unified-platform-poc.srikanthvudharapu.workers.dev"
```

**Start tunnel:**
```bash
cloudflared tunnel --config .cloudflared/config.yml run unified-platform-poc
```

Keep this running in a separate terminal.

### 4. Access Application

**Via Cloudflare Tunnel:**
- Tenant 1: `https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev`
- Tenant 2: `https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev`
- Tenant 3: `https://tenant3.unified-platform-poc.srikanthvudharapu.workers.dev`

**Via Localhost (for testing):**
- Use `Host` header: `curl -H "Host: tenant1.localhost" http://localhost:3000`

## Test Credentials

| Tenant | Email | Password | Expected Data |
|--------|-------|----------|---------------|
| tenant1 | admin@acme.com | password123 | 2 forms, 2 work orders, 2 users |
| tenant2 | admin@global.com | password123 | 1 form, 1 work order, 1 user |
| tenant3 | admin@startup.com | password123 | 1 form, 1 work order, 1 user |

## What to Observe

### 1. Tenant Isolation

**Test:**
```bash
# Login as Tenant 1
TOKEN1=$(curl -s -X POST https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.com","password":"password123"}' | jq -r '.data.token')

# Access Tenant 1 data (should work)
curl -H "Authorization: Bearer $TOKEN1" \
  https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms | jq '.data | length'
# Expected: 2

# Try accessing Tenant 2 data (should fail)
curl -H "Authorization: Bearer $TOKEN1" \
  https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms
# Expected: {"error":"Forbidden","message":"Access denied: Token tenant does not match subdomain tenant"}
```

**Observe:**
- Each tenant sees only their data
- Cross-tenant access returns 403 Forbidden
- Subdomain determines tenant context

### 2. Pre-filled Data

**Test:**
```bash
# Tenant 1 should see 2 forms
curl -H "Authorization: Bearer $TOKEN1" \
  https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms | jq '.data[].title'

# Tenant 2 should see 1 form
TOKEN2=$(curl -s -X POST https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@global.com","password":"password123"}' | jq -r '.data.token')
curl -H "Authorization: Bearer $TOKEN2" \
  https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms | jq '.data[].title'
```

**Observe:**
- Forms are pre-filled with realistic data
- Each tenant has different forms
- Work orders are also pre-filled

### 3. Subdomain Routing

**Test:**
```bash
# Same token, different subdomain
curl -H "Authorization: Bearer $TOKEN1" \
  https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms
# Should fail - tenant mismatch
```

**Observe:**
- Subdomain overrides JWT tenant
- System enforces subdomain-based tenant context
- Wildcard DNS routes all subdomains to same backend

## Architecture

```
Cloudflare Tunnel (wildcard DNS routes all subdomains)
    ↓
Backend (localhost:3000)
    ├── Subdomain Middleware (extracts tenant from hostname)
    ├── Auth Middleware (validates JWT, extracts tenant from token)
    ├── Tenant Middleware (enforces: JWT tenant must match subdomain tenant)
    └── Routes (all queries filtered by tenantId)
        ├── /api/v1/forms
        ├── /api/v1/maintenance/work_orders
        └── /api/v1/users
    ↓
MongoDB (all queries include tenantId filter)
Redis (rate limiting with tenant namespace)
```

**Key Point:** Tunnel config uses catch-all ingress (single service entry). Subdomain extraction and tenant routing is handled by backend middleware reading the `Host` header.

## Key Files

- `.cloudflared/config.yml` - Tunnel configuration
- `backend/src/middleware/subdomain.middleware.js` - Extracts tenant from subdomain
- `backend/src/middleware/tenant.middleware.js` - Enforces tenant isolation
- `backend/scripts/seed-data.js` - Test data generator

## Troubleshooting

**Tunnel not connecting:**
```bash
# Check tunnel status
cloudflared tunnel info unified-platform-poc

# Check if tunnel is running
ps aux | grep cloudflared

# Check logs (if running in background)
tail -f /tmp/cloudflared.log

# Restart tunnel
pkill -f "cloudflared tunnel"
cloudflared tunnel --config .cloudflared/config.yml run unified-platform-poc
```

**Backend not starting:**
```bash
docker-compose logs backend
```

**No data visible:**
```bash
# Re-seed data
docker-compose exec backend node scripts/seed-data.js
```

**Tenant isolation not working:**
- Verify subdomain middleware runs before auth middleware
- Check logs: `docker-compose logs backend | grep tenant`

## Development Workflow

1. **Make code changes** → Auto-reloads (volume mount)
2. **Test locally** → Use `Host` header: `curl -H "Host: tenant1.localhost" ...`
3. **Test via tunnel** → Access via Cloudflare URLs
4. **Verify isolation** → Test cross-tenant access (should fail)

## Stop Services

```bash
# Stop tunnel
pkill -f "cloudflared tunnel"

# Stop Docker services
docker-compose down

# Remove volumes (clears all data)
docker-compose down -v
```

## Quick Verification Script

```bash
# Run all verification tests (localhost - works immediately)
echo "1. Backend health:" && curl -s http://localhost:3000/health | jq '.status'
echo "2. Tunnel process:" && ps aux | grep -v grep | grep "cloudflared tunnel" | wc -l | xargs -I {} echo "Running: {} process(es)"
echo "3. Tenant 1 login (localhost):" && TOKEN1=$(curl -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -H "Host: tenant1.localhost" -d '{"email":"admin@acme.com","password":"password123"}' | jq -r '.data.token') && [ -n "$TOKEN1" ] && echo "✓" || echo "✗"
echo "4. Tenant isolation (localhost):" && [ -n "$TOKEN1" ] && curl -s -H "Authorization: Bearer $TOKEN1" -H "Host: tenant2.localhost" http://localhost:3000/api/v1/forms | jq -r '.error // "BROKEN"'
echo "5. Cloudflare tunnel (if DNS propagated):" && curl -s -m 5 https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/health | jq -r '.status // "DNS not ready"'
```

**Note:** Cloudflare tunnel URLs may take 2-5 minutes for DNS propagation. Use localhost with Host header for immediate testing.

