# MongoDB Viewer Backend Specs

## Backend API Endpoints
- [x] `GET /databases` — List all databases
- [x] `GET /collections/:db` — List collections in a given database
- [x] `GET /documents/:db/:col` — Return sample documents (first 10)

## MongoDB Connection
- [x] Uses Docker container `mock-mongo` (IP: 172.17.0.2 or localhost:27017 if mapped)
- [x] Authenticates as `readonly` user (db: admin)
- [x] Deprecated MongoDB options removed

## To Do
- [ ] Add Swagger (OpenAPI) documentation for all endpoints
- [ ] Expose Swagger UI or YAML/JSON route
- [x] Test all endpoints via terminal

## Status
- All endpoints tested and working with the running MongoDB container. 