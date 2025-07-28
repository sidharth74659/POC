Note: Replace {{subdomain}} with the subdomain of the tenant.


1. To check if a tenant exists (no auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/tenants/check' \
--header 'Content-Type: application/json' 
```


**Response:**
```json
// success
{
    "success": true,
    "data": {
        "id": "6883bd273ef9a66911617c62",
        "name": "<company-name>",
        "subdomain": "<subdomain>",
        "isActive": true
    }
}

// error
{
    "success": false,
    "message": "Tenant not found"
}
```
