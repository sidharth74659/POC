Note:
- Replace {{subdomain}} with the subdomain of the tenant.
- `customerId` from the response is taken from the [customers](./customers.md) response.

1. To create an order (auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
    "customerId": "CUST_1753735212278_ojdi03if1",
    "orderId": "ORD001",
    "details": {
        "product": "Product A",
        "quantity": 2,
        "price": 100,
        "notes": "Test order"
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
        "customerId": "CUST_1753735212278_ojdi03if1",
        "orderId": "ORD_1753741839836_ujegxqger",
        "details": {
            "product": "Product A",
            "quantity": 2,
            "price": 100,
            "notes": "Test order"
        },
        "status": "pending",
        "_id": "6887fa0f13bc3d6bb1c19f4f",
        "createdAt": "2025-07-28T22:30:39.836Z",
        "updatedAt": "2025-07-28T22:30:39.837Z",
        "__v": 0
    }
}
```


2. To get all orders (auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>'
```

**Response:**
```json
// success
{
    "success": true,
    "data": [
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6887fa0f13bc3d6bb1c19f4f",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "orderId": "ORD_1753741839836_ujegxqger",
            "status": "pending",
            "createdAt": "2025-07-28T22:30:39.836Z",
            "updatedAt": "2025-07-28T22:30:39.837Z",
            "__v": 0
        },
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6887f9f513bc3d6bb1c19f4b",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "orderId": "ORD_1753741813703_39yfnj0xw",
            "status": "pending",
            "createdAt": "2025-07-28T22:30:13.704Z",
            "updatedAt": "2025-07-28T22:30:13.705Z",
            "__v": 0
        },
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6887e0ebc6d5812cf96a8d27",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "orderId": "ORD_1753735403060_0mq0z9rs2",
            "status": "pending",
            "createdAt": "2025-07-28T20:43:23.061Z",
            "updatedAt": "2025-07-28T20:43:23.062Z",
            "__v": 0
        },
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6883f6769eccc9e7fa77ce66",
            "tenantId": "tenantb",
            "customerId": "CUST001",
            "orderId": "ORD001",
            "status": "pending",
            "createdAt": "2025-07-25T21:26:14.040Z",
            "updatedAt": "2025-07-25T21:26:14.041Z",
            "__v": 0
        },
        {
            "status": "pending",
            "_id": "6883dffa7dec744705af4c64",
            "tenantId": "tenantb",
            "product": "Test Product",
            "quantity": 5,
            "price": 25.5,
            "createdAt": "2025-07-25T19:50:18.382Z",
            "__v": 0,
            "updatedAt": "2025-07-28T22:31:18.032Z"
        },
        {
            "status": "pending",
            "_id": "6883bd7f98c94e2ec362999b",
            "tenantId": "tenantb",
            "product": "Widget",
            "quantity": 2,
            "price": 50,
            "createdAt": "2025-07-25T17:23:11.858Z",
            "__v": 0,
            "updatedAt": "2025-07-28T22:31:18.032Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 6,
        "pages": 1
    }
}
```


3. To get an order by customerId (auth required):

**Request:**
```bash
curl --location 'https://{{subdomain}}.hubnest.live/api/orders/customer/<customerId>' \
--header 'Authorization: Bearer <token>'
```

**Response:**
```json
// success
{
    "success": true,
    "data": [
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6887fa0f13bc3d6bb1c19f4f",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "orderId": "ORD_1753741839836_ujegxqger",
            "status": "pending",
            "createdAt": "2025-07-28T22:30:39.836Z",
            "updatedAt": "2025-07-28T22:30:39.837Z",
            "__v": 0
        },
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6887f9f513bc3d6bb1c19f4b",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "orderId": "ORD_1753741813703_39yfnj0xw",
            "status": "pending",
            "createdAt": "2025-07-28T22:30:13.704Z",
            "updatedAt": "2025-07-28T22:30:13.705Z",
            "__v": 0
        },
        {
            "details": {
                "product": "Product A",
                "quantity": 2,
                "price": 100,
                "notes": "Test order"
            },
            "_id": "6887e0ebc6d5812cf96a8d27",
            "tenantId": "tenantb",
            "customerId": "CUST_1753735212278_ojdi03if1",
            "orderId": "ORD_1753735403060_0mq0z9rs2",
            "status": "pending",
            "createdAt": "2025-07-28T20:43:23.061Z",
            "updatedAt": "2025-07-28T20:43:23.062Z",
            "__v": 0
        }
    ]
}
```