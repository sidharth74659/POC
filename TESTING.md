# Testing Guide - Multi-Tenant SaaS with Cloudflare Tunnel

## Setup

1. **Start Docker services:**
   ```bash
   docker-compose up -d
   ```

2. **Seed test data:**
   ```bash
   docker-compose exec backend node scripts/seed-data.js
   ```

3. **Start Cloudflare Tunnel:**
   ```bash
   cloudflared tunnel --config .cloudflared/config.yml run unified-platform-poc
   ```

## Test Credentials

### Tenant 1 (tenant1.unified-platform-poc.srikanthvudharapu.workers.dev)
- **Admin:** admin@acme.com / password123
- **User:** user@acme.com / password123
- **Expected Data:**
  - 2 Forms: Customer Feedback Survey, Employee Onboarding Form
  - 2 Work Orders: Server Room HVAC Maintenance, Office Lighting Repair
  - 2 Users: admin@acme.com, user@acme.com

### Tenant 2 (tenant2.unified-platform-poc.srikanthvudharapu.workers.dev)
- **Admin:** admin@global.com / password123
- **Expected Data:**
  - 1 Form: Quality Inspection Report
  - 1 Work Order: Production Line Machine Calibration
  - 1 User: admin@global.com

### Tenant 3 (tenant3.unified-platform-poc.srikanthvudharapu.workers.dev)
- **Admin:** admin@startup.com / password123
- **Expected Data:**
  - 1 Form: Loan Application Form
  - 1 Work Order: Office Printer Maintenance
  - 1 User: admin@startup.com

## Testing Tenant Isolation

### Test 1: Access Tenant 1
1. Navigate to: `https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev`
2. Login with: `admin@acme.com / password123`
3. Verify:
   - Dashboard shows correct user
   - Forms page shows 2 forms (Customer Feedback Survey, Employee Onboarding Form)
   - Maintenance page shows 2 work orders
   - User Management shows 2 users

### Test 2: Access Tenant 2
1. Navigate to: `https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev`
2. Login with: `admin@global.com / password123`
3. Verify:
   - Dashboard shows correct user
   - Forms page shows 1 form (Quality Inspection Report)
   - Maintenance page shows 1 work order
   - User Management shows 1 user
   - **CRITICAL:** Should NOT see Tenant 1's data

### Test 3: Access Tenant 3
1. Navigate to: `https://tenant3.unified-platform-poc.srikanthvudharapu.workers.dev`
2. Login with: `admin@startup.com / password123`
3. Verify:
   - Dashboard shows correct user
   - Forms page shows 1 form (Loan Application Form)
   - Maintenance page shows 1 work order
   - User Management shows 1 user
   - **CRITICAL:** Should NOT see Tenant 1 or Tenant 2's data

### Test 4: Cross-Tenant Access Attempt
1. Login to Tenant 1
2. Try to access Tenant 2's data via API:
   ```bash
   # This should fail - tenant isolation
   curl -H "Authorization: Bearer <tenant1_token>" \
     https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms
   # Should only return Tenant 1's forms
   ```

### Test 5: Data Visualization
1. Login to any tenant
2. Navigate to Data Visualization page
3. Verify:
   - Shows all tenants in MongoDB (admin view)
   - Shows Redis keys (if any)
   - Can see tenant isolation in data

## API Testing

### Test Tenant 1 Forms
```bash
# Get token
TOKEN=$(curl -s -X POST https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.com","password":"password123"}' | jq -r '.data.token')

# List forms (should return 2)
curl -H "Authorization: Bearer $TOKEN" \
  https://tenant1.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms
```

### Test Tenant 2 Forms
```bash
# Get token
TOKEN=$(curl -s -X POST https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@global.com","password":"password123"}' | jq -r '.data.token')

# List forms (should return 1, different from tenant1)
curl -H "Authorization: Bearer $TOKEN" \
  https://tenant2.unified-platform-poc.srikanthvudharapu.workers.dev/api/v1/forms
```

## Verification Checklist

- [ ] Tenant 1 can only see Tenant 1's data
- [ ] Tenant 2 can only see Tenant 2's data
- [ ] Tenant 3 can only see Tenant 3's data
- [ ] Forms are pre-filled and visible in each tenant
- [ ] Work orders are pre-filled and visible in each tenant
- [ ] Users are correctly isolated per tenant
- [ ] Subdomain routing works correctly
- [ ] Authentication works with subdomain-based tenant identification
- [ ] Data visualization shows all tenants (admin view)
- [ ] No cross-tenant data leakage

