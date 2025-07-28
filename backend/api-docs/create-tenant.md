Note:

Note: Replace {{subdomain}} with the subdomain of the tenant.


1. To create a tenant (no auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/tenants' \
--header 'Content-Type: application/json'
--data-raw '{
    "name": "Test Tenant",
    "subdomain": "{{subdomain}}",
    "adminEmail": "admin@{{subdomain}}.com",
    "adminPassword": "password123"
}'
```
- (ignore this case for now) To create a tenant you need to be in same domain (thoughts on this? What if user wants a different domain-name? Also, what if it doesn't exist?)

**Response:**
```json
// success
{
    "success": true,
    "message": "Tenant created at https://tenantd.hubnest.live"
}

// error
{
    "success": false,
    "message": "Subdomain taken"
}
```
