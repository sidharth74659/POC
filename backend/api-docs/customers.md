Note:
- Replace {{subdomain}} with the subdomain of the tenant.
- Replace <token> with the token of the user.
- `customerId` from the response is used in the requests related to [orders](./orders.md).


1. To create a customer (auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/customers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data-raw '{
    "customerId": "CUST001",
    "name": "John Doe",
    "contact": {
        "email": "john@example.com",
        "phone": "+1234567890"
    }
}'
```

**Response:**
```json
// success
{
    "success": true,
    "data": {
        "tenantId": "tenantb",
        "customerId": "CUST_1753741608126_9dpj1b6wa",
        "name": "John Doe",
        "contact": {
            "email": "john@example.com",
            "phone": "+1234567890"
        },
        "isActive": true,
        "_id": "6887f92813bc3d6bb1c19f44",
        "createdAt": "2025-07-28T22:26:48.129Z",
        "updatedAt": "2025-07-28T22:26:48.130Z",
        "__v": 0
    }
}
```


2. To get all customers (auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/customers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>'
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "contact": {
                "email": "john@example.com",
                "phone": "+1234567890"
            },
            "_id": "6887f92813bc3d6bb1c19f44",
            "tenantId": "tenantb",
            "customerId": "CUST_1753741608126_9dpj1b6wa",
            "name": "John Doe",
            "isActive": true,
            "createdAt": "2025-07-28T22:26:48.129Z",
            "updatedAt": "2025-07-28T22:26:48.130Z",
            "__v": 0
        },
        {
            "contact": {
                "email": "john@example.com",
                "phone": "+1234567890"
            },
            "_id": "6887e02cc6d5812cf96a8d1e",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "name": "John Doe",
            "isActive": true,
            "createdAt": "2025-07-28T20:40:12.280Z",
            "updatedAt": "2025-07-28T20:40:12.281Z",
            "__v": 0
        },
        {
            "contact": {
                "email": "john@example.com",
                "phone": "+1234567890"
            },
            "_id": "6883f6669eccc9e7fa77ce5d",
            "tenantId": "tenantb",
            "customerId": "CUST001",
            "name": "John Doe",
            "isActive": true,
            "createdAt": "2025-07-25T21:25:58.211Z",
            "updatedAt": "2025-07-25T21:25:58.213Z",
            "__v": 0
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 3,
        "pages": 1
    }
}
```
