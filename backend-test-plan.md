# MongoDB Viewer Backend Test Plan

## API Endpoint Checklist
- [x] GET /databases — returns array of database names
- [x] GET /collections/:db — returns array of collection names for given db
- [x] GET /documents/:db/:col — returns array of up to 10 documents from collection
- [ ] Swagger doc route returns valid OpenAPI spec

## Manual Test Results
- All endpoints return expected data with no errors using the mock-mongo container.
- Authentication and permissions confirmed for readonly user.

## To Do
- [ ] Validate Swagger doc route and content 