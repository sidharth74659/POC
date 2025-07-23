```sh
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Acme Corp", "requestedSubdomain":"acme", "adminEmail":"admin@acme.com", "adminPassword":"secret"}'
```

# Multi-Tenant SaaS Monorepo

This is a placeholder README for the multi-tenant SaaS monorepo project.

# Multi-Tenant SaaS Starter

## 📌 Features

- Node.js + Express + MongoDB
- Angular frontend with JWT auth
- Wildcard subdomain routing
- NGINX proxy + HTTPS with Let’s Encrypt
- Docker Compose for backend, frontend, and NGINX

## ⚙️ Local Dev

1. Add `127.0.0.1 tenant1.localhost` to `/etc/hosts`
2. Run backend:

```sh
cd backend && npm install && npm run dev
```

3. Run frontend:

```sh
cd frontend && npm install && npm run start
```

## ⚙️ Docker Deployment

1. Place wildcard DNS `*.yourcompany.com` → your server IP.
2. Run Certbot manually to get `/etc/letsencrypt`.
3. Start:

```sh
cd deploy && docker-compose up --build
```

## 🚀 Create Tenant

```sh
POST /api/tenants
{
  "companyName": "Acme",
  "requestedSubdomain": "acme",
  "adminEmail": "admin@acme.com",
  "adminPassword": "secret"
}
```

Visit: https://acme.yourcompany.com

---
